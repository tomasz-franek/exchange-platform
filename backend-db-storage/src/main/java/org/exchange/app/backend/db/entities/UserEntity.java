package org.exchange.app.backend.db.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.exchange.app.backend.db.DBConstants;

@Entity
@Table(name = "exchange_user", schema = DBConstants.SCHEMA_NAME)
@Getter
@Setter
public class UserEntity extends VersionEntity {

  @Id
  private UUID id;

  @Column(name = "email", nullable = false, length = 256)
  private String email;

}
