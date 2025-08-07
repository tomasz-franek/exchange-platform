package org.exchange.app.backend.db.repositories;

import java.util.Optional;
import java.util.UUID;
import org.exchange.app.backend.db.entities.AddressEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AddressRepository extends VersionRepository<AddressEntity, UUID>,
		JpaRepository<AddressEntity, UUID> {

	Optional<AddressEntity> findByUserId(UUID userId);
}
