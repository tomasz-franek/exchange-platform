package org.exchange.app.backend.db.repositories;

import java.util.Optional;
import org.exchange.app.backend.db.entities.SystemSnapshotEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemSnapshotRepository extends JpaRepository<SystemSnapshotEntity, Long> {

	@Query("SELECT sse "
			+ "FROM SystemSnapshotEntity sse "
			+ "ORDER BY sse.id "
			+ "DESC LIMIT 1")
	Optional<SystemSnapshotEntity> getLastSnapshotObject();
}
