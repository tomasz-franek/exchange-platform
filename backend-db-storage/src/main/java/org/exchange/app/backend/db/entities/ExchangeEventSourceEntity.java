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
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import java.sql.Timestamp;
import java.util.UUID;
import lombok.Getter;
import lombok.Setter;
import org.exchange.app.backend.db.DBConstants;
import org.exchange.app.common.api.model.EventType;

@Table(name = "exchange_event_source", schema = DBConstants.SCHEMA_NAME)
@Entity
@Getter
@Setter
public class ExchangeEventSourceEntity {

  @Id
  @SequenceGenerator(
      name = "exchange_event_source_seq",
      sequenceName = "exchange_event_source_seq",
      schema = DBConstants.SCHEMA_NAME,
      allocationSize = 500
  )
  @GeneratedValue(
      strategy = GenerationType.SEQUENCE,
      generator = "exchange_event_source_seq"
  )
  private Long id;

  @Column(name = "user_account_id")
  private UUID userAccountId;

  @Column(name = "date_utc")
  @Temporal(TemporalType.TIMESTAMP)
  Timestamp dateUtc;

  @Column(name = "event_type", nullable = false, length = 20)
  @Enumerated(EnumType.STRING)
  private EventType eventType;

  @Column(name = "amount")
  private Long amount;
}
