package org.exchange.app.backend.repositories;

import org.exchange.app.backend.entities.ExchangeEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExchangeEventRepository extends JpaRepository<ExchangeEventEntity, Long> {

}
