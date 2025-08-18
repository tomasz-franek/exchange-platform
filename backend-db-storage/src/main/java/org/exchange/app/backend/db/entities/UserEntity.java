package org.exchange.app.backend.db.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.exchange.app.backend.db.DBConstants;
import org.exchange.app.common.api.model.UserStatus;

@Entity
@Table(name = "exchange_user", schema = DBConstants.SCHEMA_NAME)
@Getter
@Setter
public class UserEntity extends VersionEntity {

  @Id
  private UUID id;

  @Column(name = "email", nullable = false, length = 256)
  private String email;

  @Column(name = "status", nullable = false, length = 20)
  @Enumerated(EnumType.STRING)
  private UserStatus status;

  @Column(name = "modified_by", length = 100)
  private String modifiedBy;

  @Column(name = "modified_date_utc")
  private LocalDateTime modifiedDateUtc;

  @Column(name = "created_date_utc")
  private LocalDateTime createdDateUtc;


}
