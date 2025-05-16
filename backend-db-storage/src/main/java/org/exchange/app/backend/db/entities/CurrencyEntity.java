package org.exchange.app.backend.db.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import java.io.Serializable;
import lombok.Getter;
import lombok.Setter;
import org.exchange.app.backend.db.DBConstants;

@Entity
@Table(name = "currency", schema = DBConstants.SCHEMA_NAME)
@Getter
@Setter
public class CurrencyEntity implements Serializable {

  @Id
  @SequenceGenerator(
      name = "currency_seq",
      sequenceName = "currency_seq",
      schema = DBConstants.SCHEMA_NAME,
      allocationSize = 1
  )
  @GeneratedValue(
      strategy = GenerationType.SEQUENCE,
      generator = "currency_seq"
  )
  private Long id;
  
  @Column(name = "code", length = 3, nullable = false)
  private String code;
}
