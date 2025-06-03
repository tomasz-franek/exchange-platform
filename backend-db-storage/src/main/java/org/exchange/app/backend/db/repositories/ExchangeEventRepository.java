package org.exchange.app.backend.db.repositories;

import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExchangeEventRepository extends JpaRepository<ExchangeEventEntity, Long>,
    PagingAndSortingRepository<ExchangeEventEntity, Long>,
    JpaSpecificationExecutor<ExchangeEventEntity> {


}
