package org.exchange.app.backend.db.repositories;

import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.db.entities.SnapshotDataEntity;
import org.exchange.app.backend.db.entities.SnapshotDataRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SnapshotDataRepository extends JpaRepository<SnapshotDataEntity, Long> {

	@Query("SELECT org.exchange.app.backend.db.entities.SnapshotDataRecord(d.userAccountId,d.amount) FROM SnapshotDataEntity d WHERE d.id > :id AND e.userAccountId IN (:list) ")
	List<SnapshotDataRecord> getAllForSnapshotAndAccountIds(Long id, List<UUID> chunk);
}
