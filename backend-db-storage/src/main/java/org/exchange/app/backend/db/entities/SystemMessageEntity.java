package org.exchange.app.backend.db.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.exchange.app.backend.db.DBConstants;

@Entity
@Table(name = "system_message", schema = DBConstants.SCHEMA_NAME)
@Getter
@Setter
public class SystemMessageEntity extends VersionEntity {

  @Id
  private UUID id;

  @Column(name = "create_date_utc", nullable = false)
  LocalDateTime createDateUtc;

  @Column(name = "message_text", nullable = false)
  String messageText;

  @Column(name = "active", nullable = false)
  boolean active;

  @Column(name = "priority", nullable = false)
  short priority;
}
