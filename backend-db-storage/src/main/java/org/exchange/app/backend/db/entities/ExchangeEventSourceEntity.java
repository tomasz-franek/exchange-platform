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
import java.time.LocalDateTime;
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

  @Column(name = "user_account_id", nullable = false)
  private UUID userAccountId;

  @Column(name = "date_utc", nullable = false)
  LocalDateTime dateUtc;

  @Column(name = "event_type", nullable = false, length = 20)
  @Enumerated(EnumType.STRING)
  private EventType eventType;

  @Column(name = "amount", nullable = false)
  private Long amount;

  @Column(name = "checksum", nullable = false)
  private Long checksum;

  @Column(name = "event_id")
  private Long eventId;

  @Column(name = "reverse_event_id")
  private Long reverseEventId;

  @Column(name = "reverse_amount")
  private Long reverseAmount;

  @Column(name = "currency", nullable = false, length = 3)
  private String currency;

  @Column(name = "ratio")
  private Long ratio;

  @Column(name = "created_by", nullable = false)
  private UUID createdBy;

  @Column(name = "created_date_utc", nullable = false)
  private LocalDateTime createdDateUtc;
}
