package exchange.stategies;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.common.api.model.Direction.SELL;
import static org.exchange.app.common.api.model.Pair.EUR_PLN;

import java.util.UUID;
import org.exchange.builders.CoreTicket;
import org.exchange.builders.CoreTicketBuilder;
import org.exchange.strategies.ratio.AverageOrderRatioStrategy;
import org.exchange.strategies.ratio.RatioStrategy;
import org.junit.jupiter.api.Test;

class AverageOrderRatioStrategyTest {

  @Test
  void getRatio() {
    RatioStrategy strategy = new AverageOrderRatioStrategy();

    CoreTicket ticket1 = CoreTicketBuilder.createBuilder()
        .withId(2L)
        .withUserId(UUID.randomUUID())
        .withPair(EUR_PLN)
        .withDirection(SELL)
        .withRatio("4.00")
        .withValue("10.00")
        .build();
    CoreTicket ticket2 = CoreTicketBuilder.createBuilder()
        .withId(3L)
        .withUserId(UUID.randomUUID())
        .withPair(EUR_PLN)
        .withDirection(SELL)
        .withRatio("3.80")
        .withValue("10.00")
        .build();
    long ratio = strategy.getRatio(ticket1, ticket2);
    assertThat(ratio).isEqualTo(3_9000);
  }
}