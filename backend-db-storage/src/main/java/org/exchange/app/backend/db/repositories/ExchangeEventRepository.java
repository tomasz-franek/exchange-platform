package org.exchange.app.backend.db.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
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
}
