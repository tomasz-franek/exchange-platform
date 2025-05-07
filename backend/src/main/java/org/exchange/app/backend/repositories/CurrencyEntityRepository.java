package org.exchange.app.backend.repositories;

import org.exchange.app.backend.entities.CurrencyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CurrencyEntityRepository extends JpaRepository<CurrencyEntity, Long> {

}
