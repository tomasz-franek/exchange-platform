package org.exchange.internal.app.core.strategies.fee;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class ZeroFeeStrategyTest {

  @Test
  void calculateFee_should_returnZero_when_amountIsPositive() {
    ZeroFeeStrategy strategy = new ZeroFeeStrategy();
    assertEquals(0, strategy.calculateFee(200));
  }

  @Test
  void calculateFee_should_returnZero_when_amountIsNegative() {
    ZeroFeeStrategy strategy = new ZeroFeeStrategy();
    assertEquals(0, strategy.calculateFee(-200));
  }
}