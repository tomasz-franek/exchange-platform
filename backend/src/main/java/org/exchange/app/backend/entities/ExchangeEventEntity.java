package org.exchange.app.backend.entities;

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

@Table(name = "exchange_event", schema = EntitiesConstants.SCHEMA_NAME)
@Entity
@Getter
@Setter
public class ExchangeEventEntity {

  @Id
  @SequenceGenerator(
      name = "exchange_event_seq",
      sequenceName = "exchange_event_seq",
      schema = EntitiesConstants.SCHEMA_NAME,
      allocationSize = 10
  )
  @GeneratedValue(
      strategy = GenerationType.SEQUENCE,
      generator = "exchange_event_seq"
  )
  private Long id;

  @Column(name = "")
  private UUID userId;
}
