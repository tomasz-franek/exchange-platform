package org.exchange.app.backend.db.repositories;

import java.util.Optional;
import org.exchange.app.backend.db.entities.CurrencyEntity;
import org.exchange.app.common.api.model.Currency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CurrencyRepository extends VersionRepository<CurrencyEntity, Long>,
    JpaRepository<CurrencyEntity, Long> {

  Optional<CurrencyEntity> findByCode(Currency currency);
}
