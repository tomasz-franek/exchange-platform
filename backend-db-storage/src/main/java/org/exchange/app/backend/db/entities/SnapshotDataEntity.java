package org.exchange.app.backend.db.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.exchange.app.backend.db.DBConstants;

@Table(name = "snapshot_data", schema = DBConstants.SCHEMA_NAME)
@Entity
@Getter
@Setter
public class SnapshotDataEntity {

  @Id
  @SequenceGenerator(
      name = "snapshot_data_seq",
      sequenceName = "snapshot_data_seq",
      schema = DBConstants.SCHEMA_NAME,
      allocationSize = 500
  )
  @GeneratedValue(
      strategy = GenerationType.SEQUENCE,
      generator = "snapshot_data_seq"
  )
  private Long id;

  @Column(name = "system_snapshot_id")
  private Long systemSnapshotId;

  @Column(name = "user_account_id")
  private UUID userAccountId;

  @Column(name = "amount")
  private Long amount;

  public SnapshotDataEntity(Long systemSnapshotId, UUID userAccountId, Long amount) {
    this.systemSnapshotId = systemSnapshotId;
    this.userAccountId = userAccountId;
    this.amount = amount;
  }
}
