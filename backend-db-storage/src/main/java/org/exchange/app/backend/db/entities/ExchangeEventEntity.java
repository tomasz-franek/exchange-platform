package org.exchange.app.backend.db.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import java.sql.Timestamp;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.exchange.app.backend.db.DBConstants;
import org.exchange.app.common.api.model.Pair;

@Table(name = "exchange_event", schema = DBConstants.SCHEMA_NAME)
@Entity
@Getter
@Setter
public class ExchangeEventEntity {

  @Id
  @SequenceGenerator(
      name = "exchange_event_seq",
      sequenceName = "exchange_event_seq",
      schema = DBConstants.SCHEMA_NAME,
      allocationSize = 500
  )
  @GeneratedValue(
      strategy = GenerationType.SEQUENCE,
      generator = "exchange_event_seq"
  )
  private Long id;

  @Column(name = "user_account_id")
  private UUID userAccountId;

  @Column(name = "pair", length = 7)
  @Enumerated(EnumType.STRING)
  private Pair pair;

  @Column(name = "direction", length = 1)
  private String direction;

  @Column(name = "date_utc")
  private Timestamp dateUtc;

  @Column(name = "event_type")
  private String eventType;

  @Column(name = "value")
  private Long value;

  @Column(name = "ratio")
  private Long ratio;
}
