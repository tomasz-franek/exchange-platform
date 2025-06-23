package org.exchange.app.backend.db.repositories;

import java.util.List;
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


  @Query("SELECT eee FROM ExchangeEventEntity eee ORDER BY eee.id ")
  List<ExchangeEventEntity> loadAllActiveOrders();
}
