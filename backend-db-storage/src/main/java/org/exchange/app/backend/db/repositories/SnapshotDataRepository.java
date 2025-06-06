package org.exchange.app.backend.db.repositories;

import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.db.entities.SnapshotDataEntity;
import org.exchange.app.backend.db.entities.SnapshotDataRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SnapshotDataRepository extends JpaRepository<SnapshotDataEntity, Long> {

	@Query(
			"SELECT new org.exchange.app.backend.db.entities.SnapshotDataRecord(d.userAccountId, d.amount) "
					+ "FROM SnapshotDataEntity d "
					+ "WHERE d.systemSnapshotId = :id "
					+ "AND d.userAccountId IN (:list) ")
	List<SnapshotDataRecord> getAllForSnapshotAndAccountIds(@Param("id") Long id,
			@Param("list") List<UUID> chunk);

	@Query("SELECT DISTINCT(d.userAccountId) "
			+ "FROM SnapshotDataEntity d "
			+ "WHERE d.systemSnapshotId = :id")
	List<UUID> getAllUserAccountIdsForSnapshotId(@Param("id") Long id);
}
