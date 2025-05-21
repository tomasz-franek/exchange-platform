package exchange.stategies;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Direction.SELL;

import org.exchange.app.common.api.model.Pair;
import org.exchange.builders.CoreTicket;
import org.exchange.builders.CoreTicketBuilder;
import org.exchange.strategies.ratio.MinimumRatioStrategy;
import org.exchange.strategies.ratio.RatioStrategy;
import org.junit.jupiter.api.Test;

class MinimumRatioStrategyTest {

  @Test
  public void getRatio_should_returnMinimumRatio_when_used() {
    RatioStrategy strategy = new MinimumRatioStrategy();
    CoreTicket orderTicket = CoreTicketBuilder.createBuilder()
        .withId(2L)
        .withPair(Pair.EUR_CHF)
        .withDirection(SELL)
        .withRatio("2")
        .withIdUser(1L)
        .withValue("100")
        .build();
    CoreTicket oppositeTicket = CoreTicketBuilder.createBuilder()
        .withId(1L)
        .withPair(Pair.EUR_CHF)
        .withDirection(BUY)
        .withRatio("3")
        .withIdUser(2L)
        .withValue("100")
        .build();
    long ratio = strategy.getRatio(orderTicket, oppositeTicket);
    assertThat(ratio).isEqualTo(orderTicket.getRatio());
  }
}