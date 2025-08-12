package org.exchange.app.backend.db.repositories;

import org.exchange.app.backend.db.entities.ExchangeResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExchangeResultRepository extends
    JpaRepository<ExchangeResultEntity, Long>,
    PagingAndSortingRepository<ExchangeResultEntity, Long>,
    JpaSpecificationExecutor<ExchangeResultEntity> {

}
