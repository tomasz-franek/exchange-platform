package org.exchange.app.backend.db.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
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
}
