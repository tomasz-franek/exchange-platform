package org.exchange.internal.app.core.strategies.fee;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.UUID;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.exchange.internal.app.core.builders.CoreTicket;
import org.exchange.internal.app.core.builders.CoreTicketBuilder;
import org.exchange.internal.app.core.exceptions.FeeCalculationException;
import org.junit.jupiter.api.Test;

class FlatFeeStrategyTest {

  @Test
  void testValidFlatFeeInitialization() {
    FlatFeeStrategy strategy = new FlatFeeStrategy(100);
    assertNotNull(strategy);
  }

  @Test
  void testNegativeFlatFeeInitialization() {
    Exception exception = assertThrows(FeeCalculationException.class, () -> {
      new FlatFeeStrategy(-50);
    });
    assertEquals("Flat fee amount cannot be negative", exception.getMessage());
  }

  @Test
  void testCalculateFeeReturnsFlatAmount() {
    FlatFeeStrategy strategy = new FlatFeeStrategy(200);
    CoreTicket coreTicket = CoreTicketBuilder.createBuilder()
        .withId(1L).withAmount(200).withRatio(2).withPair(Pair.GBP_USD)
        .withUserId(UUID.randomUUID()).withDirection(Direction.SELL)
        .build();
    assertEquals(200, strategy.calculateFee(coreTicket));
  }
}