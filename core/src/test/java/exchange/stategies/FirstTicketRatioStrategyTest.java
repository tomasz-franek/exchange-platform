package exchange.stategies;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.exchange.app.common.api.model.Direction.SELL;

import org.exchange.app.common.api.model.Pair;
import org.exchange.builders.CoreTicket;
import org.exchange.builders.CoreTicketBuilder;
import org.exchange.stategies.FirstTicketRatioStrategy;
import org.exchange.stategies.RatioStrategy;
import org.junit.jupiter.api.Test;

class FirstTicketRatioStrategyTest {

  @Test
  public void getRatio_should_returnOrderTicketRatio_when_OrderTicketIdIsLowerOppositeTicketId() {
    RatioStrategy strategy = new FirstTicketRatioStrategy();
    CoreTicket orderTicket = CoreTicketBuilder.createBuilder()
        .withId(1L)
        .withEpochUTC(100)
        .withIdUser(2L)
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio("2")
        .withValue("100")
        .build();
    CoreTicket oppositeTicket = CoreTicketBuilder.createBuilder()
        .withId(2L)
        .withEpochUTC(100)
        .withIdUser(2L)
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio("3")
        .withValue("100")
        .build();
    long ratio = strategy.getRatio(orderTicket, oppositeTicket);
    assertThat(ratio).isEqualTo(orderTicket.getRatio());
  }

  @Test
  public void getRatio_should_returnOppositeTicketRatio_when_OrderTicketIdIsHigherOppositeTicketId() {
    RatioStrategy strategy = new FirstTicketRatioStrategy();
    CoreTicket orderTicket = CoreTicketBuilder.createBuilder()
        .withId(2L)
        .withEpochUTC(200)
        .withIdUser(2L)
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio("2")
        .withValue("100")
        .build();
    CoreTicket oppositeTicket = CoreTicketBuilder.createBuilder()
        .withId(1L)
        .withEpochUTC(100)
        .withIdUser(1L)
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio("3")
        .withValue("100")
        .build();
    long ratio = strategy.getRatio(orderTicket, oppositeTicket);
    assertThat(ratio).isEqualTo(oppositeTicket.getRatio());
  }
}