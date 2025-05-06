package org.exchange.app.backend.repositories;

import org.exchange.app.backend.entities.ExchangeEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExchangeEventRepository extends JpaRepository<ExchangeEventEntity, Long> {

}
