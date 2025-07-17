package org.exchange.app.backend.db.repositories;

import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.db.entities.SystemMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface SystemMessageRepository extends JpaRepository<SystemMessageEntity, UUID>,
    VersionRepository<SystemMessageEntity, UUID> {

  @Query("SELECT sme "
      + "FROM SystemMessageEntity sme "
      + "WHERE sme.active = true " )
  List<SystemMessageEntity> loadActiveSystemMessages();
}
