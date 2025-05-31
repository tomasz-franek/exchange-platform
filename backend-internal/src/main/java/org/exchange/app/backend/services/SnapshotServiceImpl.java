package org.exchange.app.backend.services;


import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.backend.db.entities.SnapshotDataEntity;
import org.exchange.app.backend.db.entities.SnapshotDataRecord;
import org.exchange.app.backend.db.entities.SystemSnapshotEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.backend.db.repositories.SnapshotDataRepository;
import org.exchange.app.backend.db.repositories.SystemSnapshotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class SnapshotServiceImpl implements SnapshotService {

	private final static int CHUNK_SIZE = 1000;

	@Autowired
	private final SnapshotDataRepository snapshotDataRepository;

	@Autowired
	private final SystemSnapshotRepository systemSnapshotRepository;

	@Autowired
	private final ExchangeEventRepository exchangeEventRepository;

	@Override
	public void generateSnapshot() {

		SystemSnapshotEntity currentSnapshot = createCurrentSystemSnapshotEntity();
		SystemSnapshotEntity lastSnapshot = systemSnapshotRepository.getLastSnapshotObject()
				.orElse(new SystemSnapshotEntity(0));
		List<UUID> userAccountIds = exchangeEventRepository.findAllUserAccounts(
				lastSnapshot.getLastEventSourceId());
		while (!userAccountIds.isEmpty()) {
			List<UUID> chunk;
			if (userAccountIds.size() < CHUNK_SIZE) {
				chunk = userAccountIds;
			} else {
				chunk = userAccountIds.subList(0, CHUNK_SIZE);
			}
			processChunk(lastSnapshot, currentSnapshot, chunk);
			userAccountIds.removeAll(userAccountIds.subList(0, CHUNK_SIZE));
		}
	}

	private void processChunk(SystemSnapshotEntity lastSnapshot, SystemSnapshotEntity currentSnapshot,
			List<UUID> chunk) {
		List<SnapshotDataEntity> currentSnapshots = new ArrayList<>();
		List<SnapshotDataRecord> previousSnapshots = snapshotDataRepository.getAllForSnapshotAndAccountIds(
				lastSnapshot.getId(), chunk);
		List<ExchangeEventEntity> currentExchangeEvents = exchangeEventRepository.getAllAfterForUserAccountIds(
				lastSnapshot.getLastEventSourceId(), chunk);
		Map<UUID, Long> amounts = new HashMap<>(previousSnapshots.size());
		previousSnapshots.forEach(snapshotDataEntity ->
				amounts.put(snapshotDataEntity.userAccountId(), snapshotDataEntity.amount()));

		currentExchangeEvents.forEach(exchangeEventEntity -> {
			long currentValue = amounts.getOrDefault(exchangeEventEntity.getUserAccountId(), 0L);
			currentValue += exchangeEventEntity.getAmount();
			amounts.put(exchangeEventEntity.getUserAccountId(), currentValue);
		});
		amounts.forEach((userAccountId, amount) -> {
			SnapshotDataEntity snapshotDataEntity = new SnapshotDataEntity();
			snapshotDataEntity.setSystemSnapshotId(currentSnapshot.getId());
			snapshotDataEntity.setUserAccountId(userAccountId);
			snapshotDataEntity.setAmount(amount);
			currentSnapshots.add(snapshotDataEntity);
		});
		if (!currentSnapshots.isEmpty()) {
			snapshotDataRepository.saveAll(currentSnapshots);
		}
	}

	private SystemSnapshotEntity createCurrentSystemSnapshotEntity() {
		long lastOperationId = getLastOperationId();
		SystemSnapshotEntity currentSnapshot = new SystemSnapshotEntity(lastOperationId);
		currentSnapshot.setDateUTC(LocalDateTime.now(ZoneOffset.UTC));
		currentSnapshot = systemSnapshotRepository.save(currentSnapshot);
		return currentSnapshot;
	}

	private long getLastOperationId() {
		return exchangeEventRepository.findMaxId();
	}


}
