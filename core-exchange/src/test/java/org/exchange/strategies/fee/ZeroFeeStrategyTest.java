package org.exchange.strategies.fee;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.UUID;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.exchange.builders.CoreTicket;
import org.exchange.builders.CoreTicketBuilder;
import org.junit.jupiter.api.Test;

class ZeroFeeStrategyTest {

  @Test
  void testCalculateFeeReturnsZero() {
    ZeroFeeStrategy strategy = new ZeroFeeStrategy();
    CoreTicket coreTicket = CoreTicketBuilder.createBuilder()
        .withId(1L).withAmount(200).withRatio(2).withPair(Pair.GBP_USD)
        .withUserId(UUID.randomUUID()).withDirection(Direction.SELL)
        .build();
    assertEquals(0, strategy.calculateFee(coreTicket));
  }

  @Test
  void testCalculateFeeWithNullCoreTicket() {
    ZeroFeeStrategy strategy = new ZeroFeeStrategy();
    assertEquals(0, strategy.calculateFee(null));
  }
}