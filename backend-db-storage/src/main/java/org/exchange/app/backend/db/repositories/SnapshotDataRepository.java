package org.exchange.app.backend.db.repositories;

import org.exchange.app.backend.db.entities.SnapshotDataEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SnapshotDataRepository extends JpaRepository<SnapshotDataEntity, Long> {

}
