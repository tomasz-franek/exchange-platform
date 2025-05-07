package org.exchange.app.backend.repositories;

import java.util.UUID;
import org.exchange.app.backend.entities.UserAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAccountEntityRepository extends JpaRepository<UserAccountEntity, UUID> {

}
