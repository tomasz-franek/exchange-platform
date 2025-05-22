package org.exchange.builders;


import java.util.UUID;
import lombok.Getter;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;

@Getter
public class ExchangeTicketBuilder extends CoreTicketBuilder {

  private Long idOrderReverse;

  public ExchangeTicketBuilder withIdOrderReverse(Long idOrderReverse) {

    this.idOrderReverse = idOrderReverse;
    return this;
  }

  public ExchangeTicketBuilder withId(Long id) {

    super.withId(id);
    return this;
  }

  public ExchangeTicketBuilder withPair(Pair pair) {

    super.withPair(pair);
    return this;
  }

  public ExchangeTicketBuilder withRatio(long ratio) {

    super.withRatio(ratio);
    return this;
  }

  public ExchangeTicketBuilder withIdUser(UUID idUser) {

    super.withIdUser(idUser);
    return this;
  }

  public ExchangeTicketBuilder withDirection(Direction direction) {

    super.withDirection(direction);
    return this;
  }

  public ExchangeTicketBuilder withValue(long value) {

    super.withValue(value);
    return this;
  }

  public static ExchangeTicketBuilder createBuilder() {

    return new ExchangeTicketBuilder();
  }
}
