package org.exchange.internal.app.core.strategies.ratio;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Direction.SELL;

import java.util.UUID;
import org.exchange.app.common.api.model.Pair;
import org.exchange.internal.app.core.builders.CoreTicket;
import org.exchange.internal.app.core.builders.CoreTicketBuilder;
import org.junit.jupiter.api.Test;

class MaximumRatioStrategyTest {

  @Test
  public void getRatio_should_returnMaximumRatio_when_used() {
    RatioStrategy strategy = new MaximumRatioStrategy();
    CoreTicket sellTicket = CoreTicketBuilder.createBuilder()
        .withId(2L)
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio("2")
        .withUserId(UUID.randomUUID())
        .withValue("100")
        .build();
    CoreTicket buyTicket = CoreTicketBuilder.createBuilder()
        .withId(1L)
        .withPair(Pair.EUR_CHF)
        .withDirection(BUY)
        .withRatio("3")
        .withUserId(UUID.randomUUID())
        .withValue("100")
        .build();
    long ratio = strategy.getRatio(sellTicket, buyTicket);
    assertThat(ratio).isEqualTo(buyTicket.getRatio());
  }
}