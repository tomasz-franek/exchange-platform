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
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicketStatus;


@Table(name = "exchange_event", schema = DBConstants.SCHEMA_NAME)
@Entity
@Getter
@Setter
public class ExchangeEventEntity extends VersionEntity {

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

  @Column(name = "user_account_id", nullable = false)
  private UUID userAccountId;

  @Column(name = "pair", nullable = false, length = 7)
  @Enumerated(EnumType.STRING)
  private Pair pair;

  @Column(name = "direction", nullable = false, length = 1)
  private String direction;

  @Column(name = "date_utc", nullable = false)
  @Temporal(TemporalType.TIMESTAMP)
  private Timestamp dateUtc;

  @Column(name = "event_type", nullable = false, length = 20)
  @Enumerated(EnumType.STRING)
  private EventType eventType;

  @Column(name = "amount", nullable = false)
  private Long amount;

  @Column(name = "ratio", nullable = false)
  private Long ratio;

  @Column(name = "ticket_status", nullable = false, length = 20)
  @Enumerated(EnumType.STRING)
  private UserTicketStatus ticketStatus;

  @Column(name = "updated_date_utc")
  @Temporal(TemporalType.TIMESTAMP)
  private Timestamp updatedDateUTC;

}
