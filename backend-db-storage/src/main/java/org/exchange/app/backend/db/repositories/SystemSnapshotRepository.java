package org.exchange.app.backend.db.repositories;

import org.exchange.app.backend.db.entities.SystemSnapshotEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemSnapshotRepository extends JpaRepository<SystemSnapshotEntity, Long> {

}
