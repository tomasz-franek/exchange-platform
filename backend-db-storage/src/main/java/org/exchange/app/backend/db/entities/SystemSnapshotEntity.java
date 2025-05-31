package org.exchange.app.backend.db.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import org.exchange.app.backend.db.DBConstants;

@Table(name = "system_snapshot", schema = DBConstants.SCHEMA_NAME)
@Entity
@Getter
@Setter
public class SystemSnapshotEntity {

  @Id
  @SequenceGenerator(
      name = "system_snapshot_seq",
      sequenceName = "system_snapshot_seq",
      schema = DBConstants.SCHEMA_NAME,
      allocationSize = 1
  )
  private Long id;

  @Column(name = "date_utc")
  LocalDateTime dateUTC;

  @Column(name = "last_event_source_id")
  private Long lastEventSourceId;

  public SystemSnapshotEntity(long lastEventSourceId) {
    this.lastEventSourceId = lastEventSourceId;
  }
}
