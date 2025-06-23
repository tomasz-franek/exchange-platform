package org.exchange.app.backend.db.repositories;

import org.exchange.app.backend.common.exceptions.EntityVersionException;
import org.exchange.app.backend.common.exceptions.ExceptionResponse;
import org.exchange.app.backend.db.entities.VersionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface VersionRepository<T extends VersionEntity, ID> extends
    JpaRepository<T, ID> {

  default void validateVersion(T entity, int version) {
    if (entity.getVersion() != version) {
      throw new EntityVersionException(ExceptionResponse.getClassName(entity.getClass()),
          entity.getVersion(), version);
    }
  }

  default void validateVersion(T entity, T newEntity) {
    if (entity.getVersion() != newEntity.getVersion()) {
      throw new EntityVersionException(ExceptionResponse.getClassName(entity.getClass()),
          entity.getVersion(), newEntity.getVersion());
    }
  }
}
