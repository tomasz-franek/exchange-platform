package org.exchange.app.backend.db.repositories;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.entities.SnapshotDataRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ExchangeEventSourceRepository extends
    JpaRepository<ExchangeEventSourceEntity, Long>,
    PagingAndSortingRepository<ExchangeEventSourceEntity, Long>,
    JpaSpecificationExecutor<ExchangeEventSourceEntity> {

  @Query("SELECT MAX(e.id) "
      + "FROM ExchangeEventSourceEntity e "
      + "WHERE e.dateUtc < :dateUtc")
  Long getMaxId(@Param("dateUtc") Timestamp dateUtc);

  @Query("SELECT DISTINCT(e.userAccountId) "
      + "FROM ExchangeEventSourceEntity e "
      + "WHERE e.id > :id")
  List<UUID> findAllExchangeEventsWithIdGreaterThan(@Param("id") Long id);

  @Query(
      "SELECT new org.exchange.app.backend.db.entities.SnapshotDataRecord(e.userAccountId, sum(e.amount)) "
          + "FROM ExchangeEventSourceEntity e "
          + "WHERE e.id > :id "
          + "AND e.userAccountId IN (:list) "
          + "GROUP BY e.userAccountId ")
  List<SnapshotDataRecord> getAllAfterForUserAccountIds(
      @Param("id") Long lastEventSourceId,
      @Param("list") List<UUID> chunk);

}
