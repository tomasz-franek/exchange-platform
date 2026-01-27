package org.exchange.app.backend.db.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import org.exchange.app.backend.db.DBConstants;

@Entity
@Table(name = "withdraw", schema = DBConstants.SCHEMA_NAME)
@Getter
@Setter
public class WithdrawEntity extends VersionEntity {

  @Id
  @SequenceGenerator(
      name = "withdraw_seq",
      sequenceName = "withdraw_seq",
      schema = DBConstants.SCHEMA_NAME,
      allocationSize = 1
  )
  @GeneratedValue(
      strategy = GenerationType.SEQUENCE,
      generator = "withdraw_seq"
  )
  private Long id;

  @ManyToOne(fetch = FetchType.EAGER)
  @JoinColumn(referencedColumnName = "id", name = "currency_id", nullable = false)
  private CurrencyEntity currency;

  @Column(name = "amount", nullable = false)
  private Long amount;

  @Column(name = "created_date_utc", nullable = false)
  private LocalDateTime createdDateUtc;

  @Column(name = "created_by", length = 100, nullable = false)
  private String createdBy;

  @Column(name = "modified_date_utc")
  private LocalDateTime modifiedDateUtc;

  @Column(name = "modified_by", length = 100)
  private String modifiedBy;
}
