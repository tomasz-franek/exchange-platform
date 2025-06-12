package org.exchange.internal.app.core.strategies.fee;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

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
    assertEquals(200, strategy.calculateFee(200));
  }
}