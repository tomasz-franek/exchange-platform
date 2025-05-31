package org.exchange.app.backend.db.repositories;

import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ExchangeEventRepository extends JpaRepository<ExchangeEventEntity, Long> {

	@Query("SELECT MAX(e.id) FROM ExchangeEventEntity e ")
	Long findMaxId();

	@Query("SELECT DISTINCT(e.userAccountId) FROM "
			+ "ExchangeEventEntity e "
			+ "WHERE e.id > :id")
	List<UUID> findAllUserAccounts(@Param("id") Long id);

	@Query("SELECT E from ExchangeEventEntity e "
			+ "WHERE e.id > :id AND e.userAccountId IN (:list) ")
	List<ExchangeEventEntity> getAllAfterForUserAccountIds(
			@Param("id") Long lastEventSourceId,
			@Param("list") List<UUID> chunk);

}
