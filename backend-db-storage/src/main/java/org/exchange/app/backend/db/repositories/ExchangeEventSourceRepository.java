package org.exchange.app.backend.db.repositories;

import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExchangeEventSourceRepository extends
		JpaRepository<ExchangeEventSourceEntity, Long> {

}
