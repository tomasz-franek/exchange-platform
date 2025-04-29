package exchange.stategies;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import exchange.app.api.model.Direction;
import exchange.app.api.model.Pair;
import exchange.builders.CoreTicket;
import exchange.builders.OrderTicketBuilder;
import org.junit.jupiter.api.Test;

class MinimumRatioStrategyTest {

  @Test
  public void getRatio_should_returnMinimumRatio_when_used() {
    RatioStrategy strategy = new MinimumRatioStrategy();
    CoreTicket orderTicket = OrderTicketBuilder.createBuilder()
        .withId(2L)
        .withPair(Pair.EUR_CHF)
        .withDirection(Direction.SELL)
        .withRatio("2")
        .withValueAmount("100")
        .build();
    CoreTicket oppositeTicket = OrderTicketBuilder.createBuilder()
        .withId(1L)
        .withPair(Pair.EUR_CHF)
        .withDirection(Direction.BUY)
        .withRatio("3")
        .withValueAmount("100")
        .build();
    long ratio = strategy.getRatio(orderTicket, oppositeTicket);
    assertThat(ratio).isEqualTo(orderTicket.getRatio());
  }
}