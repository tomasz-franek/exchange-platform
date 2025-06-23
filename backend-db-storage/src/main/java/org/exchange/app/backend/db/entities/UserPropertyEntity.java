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
@Table(name = "user_property", schema = DBConstants.SCHEMA_NAME)
@Getter
@Setter
public class UserPropertyEntity extends VersionEntity {

  @Id
  private UUID userId;

  @Column(name = "unicode_locale", nullable = false, length = 5)
  private String language;

  @Column(name = "timezone", nullable = false, length = 30)
  private String timezone;

}
