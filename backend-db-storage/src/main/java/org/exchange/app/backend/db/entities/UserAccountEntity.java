package org.exchange.app.backend.db.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.exchange.app.backend.db.DBConstants;

@Entity
@Table(name = "user_account", schema = DBConstants.SCHEMA_NAME)
@Getter
@Setter
public class UserAccountEntity {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(referencedColumnName = "id", name = "currency_id")
  private CurrencyEntity currency;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(referencedColumnName = "id", name = "user_id")
  private UserEntity user;

  @Version
  @Column(name = "version")
  private int version;
}
