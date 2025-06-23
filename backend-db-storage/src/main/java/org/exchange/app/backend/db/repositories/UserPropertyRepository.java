package org.exchange.app.backend.db.repositories;

import java.util.UUID;
import org.exchange.app.backend.db.entities.UserPropertyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserPropertyRepository extends VersionRepository<UserPropertyEntity, UUID>,
    JpaRepository<UserPropertyEntity, UUID> {

}
