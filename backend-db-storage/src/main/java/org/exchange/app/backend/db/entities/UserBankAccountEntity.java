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
@Table(name = "user_bank_account", schema = DBConstants.SCHEMA_NAME)
@Getter
@Setter
public class UserBankAccountEntity extends VersionEntity {

  @Id
  private UUID id;

  @Column(name = "user_account_id", nullable = false)
  private UUID userAccountId;

  @Column(name = "account_number", length = 50, nullable = false)
  private String accountNumber;

  @Column(name = "country", nullable = false, length = 2)
  String countryCode;

  @Column(name = "created_date_utc", nullable = false)
  private LocalDateTime createdDateUtc;

  @Column(name = "created_by", length = 100, nullable = false)
  private String createdBy;

  @Column(name = "modified_date_utc")
  private LocalDateTime modifiedDateUtc;

  @Column(name = "modified_by", length = 100)
  private String modifiedBy;

  @Column(name = "validate_date_utc")
  private LocalDateTime validateDateUtc;

  @Column(name = "validate_by", length = 100)
  private String validateBy;


}
