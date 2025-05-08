package org.exchange.app.backend.configs;

import exchange.app.internal.api.model.Direction;
import java.io.Serializable;
import java.util.UUID;
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
  private UUID idUserAccount;
  private Direction direction;
  private long epochUTC;
}
