package org.exchange.app.backend.db.repositories;

import java.sql.Date;
import java.time.LocalDate;
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
      + "WHERE CAST(e.dateUtc as Date) = :localDate")
  Long getMaxId(@Param("localDate") LocalDate localDate);

  @Query(value = "SELECT DISTINCT(e.userAccountId) "
      + "FROM ExchangeEventSourceEntity e "
      + "WHERE CAST(e.dateUtc as Date) = :localDate")
  List<UUID> findAllExchangeEventsForDate(@Param("localDate") LocalDate localDate);

  @Query(
      "SELECT new org.exchange.app.backend.db.entities.SnapshotDataRecord(e.userAccountId, sum(e.amount)) "
          + "FROM ExchangeEventSourceEntity e "
          + "WHERE e.id > :id "
          + "AND e.userAccountId IN (:list) "
          + "GROUP BY e.userAccountId ")
  List<SnapshotDataRecord> getAllAfterForUserAccountIds(
      @Param("id") Long lastEventSourceId,
      @Param("list") List<UUID> chunk);

  @Query("SELECT DISTINCT(DATE(e.dateUtc)) "
      + "FROM ExchangeEventSourceEntity e "
      + "WHERE "
      + "CAST(e.dateUtc as Date) < CURRENT_DATE AND "
      + "CAST(e.dateUtc as Date) NOT IN ( "
      + " SELECT DISTINCT( ss.dateUtc)  "
      + " FROM SystemSnapshotEntity ss "
      + ") "
      + "ORDER BY DATE(e.dateUtc)")
  List<Date> getDaysWithoutSnapshot();


  @Query("SELECT SUM(ees.amount) "
      + "FROM ExchangeEventSourceEntity ees "
      + "JOIN FETCH UserAccountEntity ae on ees.userAccountId = ae.id "
      + "WHERE "
      + "ees.currency = :currency "
      + "AND ees.eventType IN ('DEPOSIT','WITHDRAW') "
      + "AND ( :userId IS NULL OR ae.user.id = :userId) ")
  Long sumAccountsAmountForCurrencyAndUser(@Param("currency") String currency,
      @Param("userId") UUID userId);

  @Query("SELECT SUM(ees.amount) "
      + "FROM ExchangeEventSourceEntity ees "
      + "JOIN ExchangeEventEntity eee on ees.eventId = eee.id "
      + "WHERE "
      + "ees.currency = :currency "
      + "AND eee.ticketStatus IN ('ACTIVE','NEW','PARTIAL_REALIZED') "
      + "AND ees.eventType IN ('EXCHANGE') "
      + "AND ( :userId IS NULL OR eee.userId = :userId) ")
  Long sumTicketsAmountForCurrencyAndUser(@Param("currency") String currency,
      @Param("userId") UUID userId);
}
