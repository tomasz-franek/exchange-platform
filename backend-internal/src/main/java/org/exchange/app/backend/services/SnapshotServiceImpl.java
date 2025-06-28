package org.exchange.app.backend.services;


import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
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

  private final static int CHUNK_SIZE = 500;

  @Autowired
  private final SnapshotDataRepository snapshotDataRepository;

  @Autowired
  private final SystemSnapshotRepository systemSnapshotRepository;

  @Autowired
  private final ExchangeEventSourceRepository exchangeEventSourceEntity;

  @Override
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void generateSnapshot(long timestampUTC) {
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
    Timestamp dateUtc = Timestamp.from(Instant.ofEpochMilli(timestampUTC));
    saveSnapshotData(userAccountIds, lastSnapshot, dateUtc);
  }

  private void saveSnapshotData(List<UUID> userAccountIds, SystemSnapshotEntity lastSnapshot,
      Timestamp dateUtc) {
    SystemSnapshotEntity currentSnapshot = createCurrentSystemSnapshotEntity(dateUtc);
    while (!userAccountIds.isEmpty()) {
      List<UUID> userAccountIdsChunk;
      if (userAccountIds.size() < CHUNK_SIZE) {
        userAccountIdsChunk = userAccountIds;
      } else {
        userAccountIdsChunk = userAccountIds.subList(0, CHUNK_SIZE);
      }
      processUserAccountIdsChunk(lastSnapshot, currentSnapshot.getId(), userAccountIdsChunk);
      if (userAccountIds.size() < CHUNK_SIZE) {
        userAccountIds.clear();
      } else {
        userAccountIds.removeAll(userAccountIds.subList(0, CHUNK_SIZE));
      }
    }
  }

  @Transactional(propagation = Propagation.REQUIRED)
  void processUserAccountIdsChunk(SystemSnapshotEntity lastSnapshot,
      Long currentSnapshotId, List<UUID> userAccountIdsChunk) {

    Map<UUID, Long> userAccountAmountsMap = prepareUserAccountAmountsMap(lastSnapshot,
        userAccountIdsChunk);

    if (!userAccountAmountsMap.isEmpty()) {
      saveSnapshotDataEntities(currentSnapshotId, userAccountAmountsMap);
    }
  }

  @Transactional(readOnly = true)
  private Map<UUID, Long> prepareUserAccountAmountsMap(SystemSnapshotEntity lastSnapshot,
      List<UUID> userAccountIdsChunk) {
    List<SnapshotDataRecord> previousSnapshotDataRecords = snapshotDataRepository.getAllForSnapshotAndAccountIds(
        lastSnapshot.getId(), userAccountIdsChunk);
    long lastEventSourceId =
        lastSnapshot.getLastEventSourceId() != null ? lastSnapshot.getLastEventSourceId() : 0;
    List<SnapshotDataRecord> currentEventsDataRecords = exchangeEventSourceEntity.getAllAfterForUserAccountIds(
        lastEventSourceId, userAccountIdsChunk);
    Map<UUID, Long> userAccountAmountsMap = new HashMap<>();
    previousSnapshotDataRecords.forEach(record ->
        userAccountAmountsMap.put(record.userAccountId(), record.amount()));

    currentEventsDataRecords.forEach(record ->
        userAccountAmountsMap.put(record.userAccountId(),
            userAccountAmountsMap.getOrDefault(record.userAccountId(), 0L) + record.amount()));
    return userAccountAmountsMap;
  }

  private void saveSnapshotDataEntities(Long currentSnapshotId,
      Map<UUID, Long> userAccountAmountsMap) {
    List<SnapshotDataEntity> snapshotDataEntities = new ArrayList<>();
    userAccountAmountsMap.forEach(
        (userAccountId, amount) -> snapshotDataEntities.add(new SnapshotDataEntity(
            currentSnapshotId, userAccountId, amount)));
    snapshotDataRepository.saveAll(snapshotDataEntities);
  }

  SystemSnapshotEntity createCurrentSystemSnapshotEntity(Timestamp dateUtc) {
    long lastOperationId = getMaxExchangeEventSourceId(dateUtc);
    SystemSnapshotEntity currentSnapshot = new SystemSnapshotEntity(lastOperationId);
    currentSnapshot.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
    currentSnapshot = systemSnapshotRepository.save(currentSnapshot);
    return currentSnapshot;
  }

  @Transactional(readOnly = true)
  private long getMaxExchangeEventSourceId(Timestamp dateUtc) {
    return exchangeEventSourceEntity.getMaxId(dateUtc);
  }
}
