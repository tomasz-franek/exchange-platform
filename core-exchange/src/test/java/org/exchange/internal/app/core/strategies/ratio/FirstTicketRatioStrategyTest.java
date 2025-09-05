package org.exchange.internal.app.core.strategies.ratio;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Direction.SELL;

import java.util.UUID;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.builders.CoreTicketBuilder;
import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;

class FirstTicketRatioStrategyTest {

  @Test
  public void getRatio_should_returnBuyTicketRatio_when_buyTicketIdIsLowerSellTicketId() {
    RatioStrategy strategy = new FirstTicketRatioStrategy();
    CoreTicket buyTicket = CoreTicketBuilder.createBuilder()
        .withId(1L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.EUR_CHF)
        .withDirection(BUY)
        .withRatio("2")
        .withAmount(100_0000)
        .build();
    CoreTicket sellTicket = CoreTicketBuilder.createBuilder()
        .withId(2L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio("3")
        .withAmount("100")
        .build();
    long ratio = strategy.getRatio(buyTicket, sellTicket);
    assertThat(ratio).isEqualTo(buyTicket.getRatio());
  }

  @Test
  public void getRatio_should_returnOpSellTicketRatio_when_BuyTicketIdIsHigherSellTicketId() {
    RatioStrategy strategy = new FirstTicketRatioStrategy();
    CoreTicket buyTicket = CoreTicketBuilder.createBuilder()
        .withId(2L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.EUR_CHF)
        .withDirection(BUY)
        .withRatio("2")
        .withAmount("100")
        .build();
    CoreTicket sellTicket = CoreTicketBuilder.createBuilder()
        .withId(1L)
        .withUserId(UUID.randomUUID())
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio("3")
        .withAmount("100")
        .build();
    long ratio = strategy.getRatio(buyTicket, sellTicket);
    assertThat(ratio).isEqualTo(sellTicket.getRatio());
  }
}