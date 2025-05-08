package exchange.stategies;

import static exchange.app.internal.api.model.Direction.BUY;
import static exchange.app.internal.api.model.Direction.SELL;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import exchange.app.internal.api.model.Pair;
import exchange.builders.CoreTicket;
import exchange.builders.CoreTicketBuilder;
import org.junit.jupiter.api.Test;

class MaximumRatioStrategyTest {

  @Test
  public void getRatio_should_returnMaximumRatio_when_used() {
    RatioStrategy strategy = new MaximumRatioStrategy();
    CoreTicket orderTicket = CoreTicketBuilder.createBuilder()
        .withId(2L)
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio("2")
        .withIdUser(1L)
        .withValueAmount("100")
        .build();
    CoreTicket oppositeTicket = CoreTicketBuilder.createBuilder()
        .withId(1L)
        .withPair(Pair.EUR_CHF)
        .withDirection(BUY)
        .withRatio("3")
        .withIdUser(2L)
        .withValueAmount("100")
        .build();
    long ratio = strategy.getRatio(orderTicket, oppositeTicket);
    assertThat(ratio).isEqualTo(oppositeTicket.getRatio());
  }
}