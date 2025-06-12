package org.exchange.internal.app.core.strategies.fee;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class ZeroFeeStrategyTest {

  @Test
  void testCalculateFeeReturnsZero() {
    ZeroFeeStrategy strategy = new ZeroFeeStrategy();
    assertEquals(0, strategy.calculateFee(200));
  }

  @Test
  void testCalculateFeeReturnsZero_when_negativeValue() {
    ZeroFeeStrategy strategy = new ZeroFeeStrategy();
    assertEquals(0, strategy.calculateFee(-200));
  }
}