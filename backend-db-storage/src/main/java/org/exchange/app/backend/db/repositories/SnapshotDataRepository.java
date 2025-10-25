package org.exchange.app.backend.db.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.db.entities.SnapshotDataEntity;
import org.exchange.app.backend.db.entities.SnapshotDataRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SnapshotDataRepository extends JpaRepository<SnapshotDataEntity, Long> {

  @Query(
      "SELECT new org.exchange.app.backend.db.entities.SnapshotDataRecord(d.userAccountId, d.amount) "
          + "FROM SnapshotDataEntity d "
          + "WHERE d.systemSnapshotId = :systemSnapshotId "
          + "AND d.userAccountId IN (:list) ")
  List<SnapshotDataRecord> getAllForSnapshotAndAccountIds(
      @Param("systemSnapshotId") Long systemSnapshotId,
      @Param("list") List<UUID> chunk);

  @Query("SELECT DISTINCT(d.userAccountId) "
      + "FROM SnapshotDataEntity d "
      + "WHERE d.systemSnapshotId = :systemSnapshotId")
  List<UUID> getAllUserAccountIdsForSnapshotId(@Param("systemSnapshotId") Long systemSnapshotId);

  @Query("SELECT d "
      + "FROM SnapshotDataEntity d "
      + "WHERE d.userAccountId = :userAccountId "
      + "ORDER BY d.id DESC "
      + "LIMIT 1")
  SnapshotDataEntity lastSnapshotDataForUserAccountId(@Param("userAccountId") UUID userAccountId);

  @Query("SELECT SUM(d.amount) "
      + "FROM SnapshotDataEntity d "
      + "JOIN SystemSnapshotEntity s ON d.systemSnapshotId = s.id "
      + "WHERE d.userAccountId = :userAccountId "
      + "AND s.dateUtc <= :dateUtc "
      + "GROUP BY d.id "
      + "ORDER BY d.id DESC "
      + "LIMIT 1")
  Long initialBalanceForUserAccountIdAndDate(@Param("userAccountId") UUID userAccountId,
      @Param("dateUtc") LocalDate dateUtc);
}
