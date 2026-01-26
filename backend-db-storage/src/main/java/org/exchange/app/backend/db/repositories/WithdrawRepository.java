package org.exchange.app.backend.db.repositories;

import org.exchange.app.backend.db.entities.WithdrawEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface WithdrawRepository extends VersionRepository<WithdrawEntity, Long>,
    JpaRepository<WithdrawEntity, Long>, JpaSpecificationExecutor<WithdrawEntity> {

}
