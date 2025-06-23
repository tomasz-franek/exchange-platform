package org.exchange.app.backend.db.entities;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.Version;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@MappedSuperclass
public class VersionEntity {

  @Version
  @Column(name = "version", nullable = false)
  private int version = 0;
}
