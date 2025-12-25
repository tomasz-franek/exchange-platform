package org.exchange.app.backend.db.repositories;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.common.api.model.Pair;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ExchangeEventRepository extends
    VersionRepository<ExchangeEventEntity, Long>,
    JpaRepository<ExchangeEventEntity, Long>,
    PagingAndSortingRepository<ExchangeEventEntity, Long>,
    JpaSpecificationExecutor<ExchangeEventEntity> {


  @Query("SELECT eee "
      + "FROM ExchangeEventEntity eee "
      + "WHERE eee.ticketStatus IN ( "
      + "org.exchange.app.common.api.model.UserTicketStatus.NEW, "
      + "org.exchange.app.common.api.model.UserTicketStatus.ACTIVE, "
      + "org.exchange.app.common.api.model.UserTicketStatus.PARTIAL_REALIZED "
      + ") "
      + "ORDER BY eee.id ")
  List<ExchangeEventEntity> loadAllActiveOrders();

  Optional<ExchangeEventEntity> findByIdAndUserId(Long ticketId, UUID userId);

  @Query("SELECT count(1) "
      + "FROM ExchangeEventEntity eee "
      + "JOIN ExchangeEventSourceEntity ees on ees.eventId = eee.id "
      + "WHERE "
      + "ees.currency = :currency "
      + "AND ( :userId IS NULL OR eee.userId = :userId) ")
  Integer countAllTickets(@Param("currency") String currency, @Param("userId") UUID userId);

  @Query("SELECT count(1) "
      + "FROM ExchangeEventEntity eee "
      + "JOIN ExchangeEventSourceEntity ees on ees.eventId = eee.id "
      + "WHERE "
      + "ees.currency = :currency "
      + "AND eee.ticketStatus IN ( "
      + "org.exchange.app.common.api.model.UserTicketStatus.NEW, "
      + "org.exchange.app.common.api.model.UserTicketStatus.ACTIVE, "
      + "org.exchange.app.common.api.model.UserTicketStatus.PARTIAL_REALIZED "
      + ") "
      + "AND ( :userId IS NULL OR eee.userId = :userId) ")
  Integer countActiveTickets(@Param("currency") String currency, @Param("userId") UUID userId);

  @Query("SELECT eee.amount "
      + "FROM ExchangeEventEntity eee "
      + "WHERE eee.pair = :pair "
      + "AND eee.direction = :direction ")
  List<Long> getActiveTicketsAmount(@Param("pair") Pair pair, @Param("direction") String direction);

  @Query(
      "SELECT COALESCE( CAST(MIN(ee.ratio) AS INTEGER),0), COALESCE( CAST(MAX(ee.ratio) AS INTEGER),0) "
          + "FROM ExchangeEventEntity ee "
          + "WHERE "
          + "ee.pair = :pair "
          + "AND ee.ticketStatus IN ( "
          + "org.exchange.app.common.api.model.UserTicketStatus.REALIZED, "
          + "org.exchange.app.common.api.model.UserTicketStatus.PARTIAL_REALIZED "
          + ") "
          + "AND ee.eventType IN (org.exchange.app.common.api.model.EventType.ORDER) "
          + "AND ee.dateUtc BETWEEN :periodStart AND :periodEnd "
          + "AND ee.direction IN ('B') ")
  List<Object[]> loadPairPeriodReport(@Param("pair") Pair pair,
      @Param("periodStart") LocalDateTime periodStart,
      @Param("periodEnd") LocalDateTime periodEnd);


  @Query("SELECT COALESCE( CAST(MAX(ee.ratio) AS INTEGER),0) "
      + "FROM ExchangeEventEntity ee "
      + "WHERE "
      + "ee.pair = :pair "
      + "AND ee.ticketStatus IN ( "
      + "org.exchange.app.common.api.model.UserTicketStatus.ACTIVE, "
      + "org.exchange.app.common.api.model.UserTicketStatus.PARTIAL_REALIZED "
      + ") "
      + "AND ee.eventType IN (org.exchange.app.common.api.model.EventType.ORDER) "
      + "AND ee.direction IN ('B') ")
  Long getCurrentRatio(@Param("pair") Pair pair);
}
