package exchange.stategies;

import static exchange.app.internal.api.model.Direction.SELL;
import static exchange.app.internal.api.model.Pair.EUR_PLN;
import static org.assertj.core.api.Assertions.assertThat;

import exchange.builders.CoreTicket;
import exchange.builders.CoreTicketBuilder;
import org.junit.jupiter.api.Test;

class AverageOrderRatioStrategyTest {

  @Test
  void getRatio() {
    RatioStrategy strategy = new AverageOrderRatioStrategy();

    CoreTicket ticket1 = CoreTicketBuilder.createBuilder()
        .withId(2L)
        .withIdUser(1L)
        .withPair(EUR_PLN)
        .withDirection(SELL)
        .withRatio("4.00")
        .withValueAmount("10.00")
        .build();
    CoreTicket ticket2 = CoreTicketBuilder.createBuilder()
        .withId(3L)
        .withIdUser(1L)
        .withPair(EUR_PLN)
        .withDirection(SELL)
        .withRatio("3.80")
        .withValueAmount("10.00")
        .build();
    long ratio = strategy.getRatio(ticket1, ticket2);
    assertThat(ratio).isEqualTo(3_9000);
  }
}