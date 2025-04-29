package exchange.stategies;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import exchange.app.api.model.Direction;
import exchange.app.api.model.Pair;
import exchange.builders.CoreTicket;
import exchange.builders.OrderTicketBuilder;
import org.junit.jupiter.api.Test;

class FirstTicketRatioStrategyTest {

  @Test
  public void getRatio_should_returnOrderTicketRatio_when_OrderTicketIdIsLowerOppositeTicketId() {
    RatioStrategy strategy = new FirstTicketRatioStrategy();
    CoreTicket orderTicket = OrderTicketBuilder.createBuilder()
        .withId(1L)
        .withEpochUTC(100)
        .withIdUser(2L)
        .withPair(Pair.EUR_CHF)
        .withDirection(Direction.SELL)
        .withRatio("2")
        .withValueAmount("100")
        .build();
    CoreTicket oppositeTicket = OrderTicketBuilder.createBuilder()
        .withId(2L)
        .withEpochUTC(100)
        .withIdUser(2L)
        .withPair(Pair.EUR_CHF)
        .withDirection(Direction.SELL)
        .withRatio("3")
        .withValueAmount("100")
        .build();
    long ratio = strategy.getRatio(orderTicket, oppositeTicket);
    assertThat(ratio).isEqualTo(orderTicket.getRatio());
  }

  @Test
  public void getRatio_should_returnOppositeTicketRatio_when_OrderTicketIdIsHigherOppositeTicketId() {
    RatioStrategy strategy = new FirstTicketRatioStrategy();
    CoreTicket orderTicket = OrderTicketBuilder.createBuilder()
        .withId(2L)
        .withEpochUTC(200)
        .withIdUser(2L)
        .withPair(Pair.EUR_CHF)
        .withDirection(Direction.SELL)
        .withRatio("2")
        .withValueAmount("100")
        .build();
    CoreTicket oppositeTicket = OrderTicketBuilder.createBuilder()
        .withId(1L)
        .withEpochUTC(100)
        .withIdUser(1L)
        .withPair(Pair.EUR_CHF)
        .withDirection(Direction.SELL)
        .withRatio("3")
        .withValueAmount("100")
        .build();
    long ratio = strategy.getRatio(orderTicket, oppositeTicket);
    assertThat(ratio).isEqualTo(oppositeTicket.getRatio());
  }
}