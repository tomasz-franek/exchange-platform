package org.exchange.app.backend.db.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import org.exchange.app.backend.db.DBConstants;

@Table(name = "exchange_result", schema = DBConstants.SCHEMA_NAME)
@Entity
@Getter
@Setter
public class ExchangeResultEntity {

  @Id
  @SequenceGenerator(
      name = "exchange_result_seq",
      sequenceName = "exchange_result_seq",
      schema = DBConstants.SCHEMA_NAME,
      allocationSize = 1
  )
  @GeneratedValue(
      strategy = GenerationType.SEQUENCE,
      generator = "exchange_result_seq"
  )
  private Long id;

  @Column(name = "buy_ticket_id", nullable = false)
  private Long buyTicketId;
  @Column(name = "buy_amount", nullable = false)
  private Long buyAmount;
  @Column(name = "sell_ticket_id", nullable = false)
  private Long sellTicketId;
  @Column(name = "sell_amount", nullable = false)
  private Long sellAmount;
  @Column(name = "ratio", nullable = false)
  private Long ratio;
  @Column(name = "exchange_date_utc", nullable = false)
  private LocalDateTime exchangeDateUTC;
}
