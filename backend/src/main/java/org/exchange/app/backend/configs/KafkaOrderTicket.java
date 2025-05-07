package org.exchange.app.backend.configs;

import exchange.app.api.model.Direction;
import java.io.Serializable;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class KafkaOrderTicket implements Serializable {

  private long id;
  private long value;
  private long ratio;
  private long idUser;
  private Direction direction;
  private long epochUTC;
}
