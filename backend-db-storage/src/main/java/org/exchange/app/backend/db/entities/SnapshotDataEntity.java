package org.exchange.app.backend.db.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
      name = "system_snapshot_seq",
      sequenceName = "system_snapshot_seq",
      schema = DBConstants.SCHEMA_NAME,
      allocationSize = 500
  )
  private Long id;

  @Column(name = "system_snapshot_id")
  private Long systemSnapshotId;

  @Column(name = "user_account_id")
  private UUID userAccountId;

  @Column(name = "amount")
  private Long amount;
}
