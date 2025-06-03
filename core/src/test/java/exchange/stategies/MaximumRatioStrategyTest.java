package exchange.stategies;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Direction.SELL;

import java.util.UUID;
import org.exchange.app.common.api.model.Pair;
import org.exchange.builders.CoreTicket;
import org.exchange.builders.CoreTicketBuilder;
import org.exchange.strategies.ratio.MaximumRatioStrategy;
import org.exchange.strategies.ratio.RatioStrategy;
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
        .withUserId(UUID.randomUUID())
        .withValue("100")
        .build();
    CoreTicket oppositeTicket = CoreTicketBuilder.createBuilder()
        .withId(1L)
        .withPair(Pair.EUR_CHF)
        .withDirection(BUY)
        .withRatio("3")
        .withUserId(UUID.randomUUID())
        .withValue("100")
        .build();
    long ratio = strategy.getRatio(orderTicket, oppositeTicket);
    assertThat(ratio).isEqualTo(oppositeTicket.getRatio());
  }
}