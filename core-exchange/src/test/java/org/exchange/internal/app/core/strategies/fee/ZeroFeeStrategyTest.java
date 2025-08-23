package org.exchange.internal.app.core.strategies.fee;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ZeroFeeStrategyTest {

  @Test
  void calculateFee_should_returnZero_when_amountIsPositive() {
    ZeroFeeStrategy strategy = new ZeroFeeStrategy();
		assertThat(strategy.calculateFee(200)).isEqualTo(0);
  }

  @Test
  void calculateFee_should_returnZero_when_amountIsNegative() {
    ZeroFeeStrategy strategy = new ZeroFeeStrategy();
		assertThat(strategy.calculateFee(-200)).isEqualTo(0);
  }
}