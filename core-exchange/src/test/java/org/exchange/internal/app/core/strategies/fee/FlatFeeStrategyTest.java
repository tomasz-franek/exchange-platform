package org.exchange.internal.app.core.strategies.fee;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.exchange.internal.app.core.exceptions.FeeCalculationException;
import org.junit.jupiter.api.Test;

class FlatFeeStrategyTest {

  @Test
  void constructor_should_beNotNull_when_flatFeeAmountIsGreaterThanZero() {
    FlatFeeStrategy strategy = new FlatFeeStrategy(100);
		assertThat(strategy).isNotNull();
  }

  @Test
  void constructor_should_throwException_when_flatFeeAmountIsNegative() {
    Exception exception = assertThrows(FeeCalculationException.class, () -> {
      new FlatFeeStrategy(-50);
    });
		assertThat(exception.getMessage()).isEqualTo("Flat fee amount cannot be negative");
  }

  @Test
  void calculateFee_should_return200_when_flatFeeAmountSetInConstructorTo200() {
    FlatFeeStrategy strategy = new FlatFeeStrategy(200);
		assertThat(strategy.calculateFee(200)).isEqualTo(200);
  }
}