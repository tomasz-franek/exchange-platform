package org.exchange.app.backend.services;


import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.db.entities.SnapshotDataEntity;
import org.exchange.app.backend.db.entities.SnapshotDataRecord;
import org.exchange.app.backend.db.entities.SystemSnapshotEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.repositories.SnapshotDataRepository;
import org.exchange.app.backend.db.repositories.SystemSnapshotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@AllArgsConstructor
@Log4j2
@EnableScheduling
public class SnapshotServiceImpl implements SnapshotService {

	private final static int CHUNK_SIZE = 1000;

	@Autowired
	private final SnapshotDataRepository snapshotDataRepository;

	@Autowired
	private final SystemSnapshotRepository systemSnapshotRepository;

	@Autowired
	private final ExchangeEventSourceRepository exchangeEventSourceEntity;

	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public void generateSnapshot() {
		log.info("Start snapshot generation");
		SystemSnapshotEntity lastSnapshot = systemSnapshotRepository.getLastSnapshotObject()
				.orElse(new SystemSnapshotEntity(0));
		List<UUID> userAccountIds = exchangeEventSourceEntity.findAllExchangeEventsWithIdGreaterThan(
				lastSnapshot.getLastEventSourceId());
		if (userAccountIds.isEmpty()) {
			return;
		}
		List<UUID> previousSnapshotAccountIds = new ArrayList<>();
		if (lastSnapshot.getId() != null && lastSnapshot.getId() > 0) {
			previousSnapshotAccountIds = snapshotDataRepository.getAllUserAccountIdsForSnapshotId(
					lastSnapshot.getId());
		}
		previousSnapshotAccountIds.forEach(userAccountId -> {
			if (!userAccountIds.contains(userAccountId)) {
				userAccountIds.add(userAccountId);
			}
		});
		SystemSnapshotEntity currentSnapshot = createCurrentSystemSnapshotEntity();
		while (!userAccountIds.isEmpty()) {
			List<UUID> chunk;
			if (userAccountIds.size() < CHUNK_SIZE) {
				chunk = userAccountIds;
			} else {
				chunk = userAccountIds.subList(0, CHUNK_SIZE);
			}
			processChunk(lastSnapshot, currentSnapshot, chunk);
			if (userAccountIds.size() < CHUNK_SIZE) {
				userAccountIds.clear();
			} else {
				userAccountIds.removeAll(userAccountIds.subList(0, CHUNK_SIZE));
			}
		}
	}

	@Transactional(propagation = Propagation.REQUIRED)
	private void processChunk(SystemSnapshotEntity lastSnapshot, SystemSnapshotEntity currentSnapshot,
			List<UUID> chunk) {
		List<SnapshotDataEntity> snapshotDataEntities = new ArrayList<>();
		List<SnapshotDataRecord> previousSnapshotDataRecords = snapshotDataRepository.getAllForSnapshotAndAccountIds(
				lastSnapshot.getId(), chunk);
		List<SnapshotDataRecord> currentEventsDataRecords = exchangeEventSourceEntity.getAllAfterForUserAccountIds(
				lastSnapshot.getLastEventSourceId() != null ? lastSnapshot.getLastEventSourceId() : 0,
				chunk);
		Map<UUID, Long> userAccountAmountsMap = new HashMap<>();
		previousSnapshotDataRecords.forEach(record ->
				userAccountAmountsMap.put(record.userAccountId(), record.amount()));

		currentEventsDataRecords.forEach(record -> {
			long currentValue = userAccountAmountsMap.getOrDefault(record.userAccountId(),
					0L);
			currentValue += record.amount();
			userAccountAmountsMap.put(record.userAccountId(), currentValue);
		});
		userAccountAmountsMap.forEach((userAccountId, amount) -> {
			SnapshotDataEntity snapshotDataEntity = new SnapshotDataEntity();
			snapshotDataEntity.setSystemSnapshotId(currentSnapshot.getId());
			snapshotDataEntity.setUserAccountId(userAccountId);
			snapshotDataEntity.setAmount(amount);
			snapshotDataEntities.add(snapshotDataEntity);
		});
		if (!snapshotDataEntities.isEmpty()) {
			snapshotDataRepository.saveAll(snapshotDataEntities);
		}
	}

	private SystemSnapshotEntity createCurrentSystemSnapshotEntity() {
		long lastOperationId = getMaxExchangeEventSourceId();
		SystemSnapshotEntity currentSnapshot = new SystemSnapshotEntity(lastOperationId);
		currentSnapshot.setDateUTC(LocalDateTime.now(ZoneOffset.UTC));
		currentSnapshot.setLastEventSourceId(lastOperationId);
		currentSnapshot = systemSnapshotRepository.save(currentSnapshot);
		return currentSnapshot;
	}

	@Transactional(readOnly = true)
	private long getMaxExchangeEventSourceId() {
		return exchangeEventSourceEntity.getMaxId();
	}
}
