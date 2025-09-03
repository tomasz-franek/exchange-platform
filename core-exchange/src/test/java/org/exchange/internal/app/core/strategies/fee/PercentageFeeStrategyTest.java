package org.exchange.internal.app.core.strategies.fee;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.exchange.internal.app.core.exceptions.FeeCalculationException;
import org.junit.jupiter.api.Test;

class PercentageFeeStrategyTest {

  @Test
  void constructor_should_initializeStrategy_when_valuePercentageFeePositive() {
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(10);
    assertThat(strategy).isNotNull();
  }

  @Test
  void constructor_should_initializeStrategy_when_zeroPercentageFeePositive() {
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(0);
    assertThat(strategy).isNotNull();
  }

  @Test
  void constructor_should_initializeStrategy_when_MaximumPercentageFeePositive100() {
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(100);
    assertThat(strategy).isNotNull();
  }

  @Test
  void calculateFee_should_calculateCorrectFee_when_amountValueIsGreaterThenZero() {
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(0.1);
    assertThat(strategy.calculateFee(20_0000)).isEqualTo(200);
  }

  @Test
  void calculateFee_should_calculateCorrectFee_when_amountValueRoundingUp() {
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(0.1);
    assertThat(strategy.calculateFee(19_9900)).isEqualTo(200);
  }

  @Test
  void calculateFee_should_calculateFeeZero_when_amountValueIsZero() {
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(15);
    assertThat(strategy.calculateFee(0)).isEqualTo(0);
  }

  @Test
  void constructor_should_generatedException_when_negativePercentageFee() {
    Exception exception = assertThrows(FeeCalculationException.class,
        () -> new PercentageFeeStrategy(-5));
    assertThat(exception.getMessage()).isEqualTo("Percentage cannot be negative");
  }

  @Test
  void constructor_should_generatedException_when_exceedingMaximumPercentage() {
    Exception exception = assertThrows(FeeCalculationException.class,
        () -> new PercentageFeeStrategy(105));
    assertThat(exception.getMessage()).isEqualTo("Percentage cannot exceed 100%");
  }

  @Test
  void calculateFee_should_calculateMinimumOneCent_when_feeAmountIsBelowOneCent() {
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(0.1);
    assertThat(strategy.calculateFee(100)).isEqualTo(100);
  }

  @Test
  void calculateFee_should_calculateZeroCent_when_feePercentIsZeroAndCalculatedFeeAmountIsBelowOneCent() {
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(0);
    assertThat(strategy.calculateFee(100)).isEqualTo(0);
  }
}