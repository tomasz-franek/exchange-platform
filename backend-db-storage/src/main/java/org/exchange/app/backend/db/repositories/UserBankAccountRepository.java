package org.exchange.app.backend.db.repositories;

import java.util.UUID;
import org.exchange.app.backend.db.entities.UserBankAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserBankAccountRepository extends JpaRepository<UserBankAccountEntity, UUID> {

}
