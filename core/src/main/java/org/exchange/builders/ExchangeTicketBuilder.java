package org.exchange.builders;


import java.util.UUID;
import lombok.Getter;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;

@Getter
public class ExchangeTicketBuilder extends CoreTicketBuilder {

  private Long reverseOrderId;

  public ExchangeTicketBuilder withReverseOrderId(Long reverseOrderId) {

    this.reverseOrderId = reverseOrderId;
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

  public ExchangeTicketBuilder withUserId(UUID userId) {

    super.withUserId(userId);
    return this;
  }

  public ExchangeTicketBuilder withDirection(Direction direction) {

    super.withDirection(direction);
    return this;
  }

  public ExchangeTicketBuilder withAmount(long amount) {

    super.withAmount(amount);
    return this;
  }

  public static ExchangeTicketBuilder createBuilder() {

    return new ExchangeTicketBuilder();
  }
}
