package org.exchange.app.backend.db.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.io.Serializable;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.exchange.app.backend.db.DBConstants;

@Entity
@Table(name = "user_property", schema = DBConstants.SCHEMA_NAME)
@Getter
@Setter
public class UserPropertyEntity implements Serializable {

  @Id
  private UUID userId;

  @Column(name = "language_code", nullable = false, length = 2)
  private String language;

  @Column(name = "timezone", nullable = false, length = 30)
  private String timezone;
}
