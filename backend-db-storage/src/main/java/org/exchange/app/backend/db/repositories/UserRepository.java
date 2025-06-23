package org.exchange.app.backend.db.repositories;

import java.util.UUID;
import org.exchange.app.backend.db.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends VersionRepository<UserEntity, UUID>,
    JpaRepository<UserEntity, UUID> {

}
