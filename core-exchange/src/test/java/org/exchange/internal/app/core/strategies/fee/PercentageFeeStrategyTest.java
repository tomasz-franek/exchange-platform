package org.exchange.internal.app.core.strategies.fee;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.exchange.internal.app.core.exceptions.FeeCalculationException;
import org.junit.jupiter.api.Test;

class PercentageFeeStrategyTest {

  @Test
  void constructor_should_initializeStrategy_when_valuePercentageFeePositive() {
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(10);
    assertNotNull(strategy);
  }

  @Test
  void constructor_should_initializeStrategy_when_zeroPercentageFeePositive() {
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(0);
    assertNotNull(strategy);
  }

  @Test
  void constructor_should_initializeStrategy_when_MaximumPercentageFeePositive100() {
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(100);
    assertNotNull(strategy);
  }

  @Test
  void calculateFee_should_calculateCorrectFee_when_amountValueIsGreaterThenZero() {
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(10);
    assertEquals(20, strategy.calculateFee(200));
  }

  @Test
  void calculateFee_should_calculateFeeZero_when_amountValueIsZero() {
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(15);
    assertEquals(0, strategy.calculateFee(0));
  }

  @Test
  void constructor_should_generatedException_when_negativePercentageFee() {
    Exception exception = assertThrows(FeeCalculationException.class, () -> {
      new PercentageFeeStrategy(-5);
    });
    assertEquals("Percentage cannot be negative", exception.getMessage());
  }

  @Test
  void constructor_should_generatedException_when_exceedingMaximumPercentage() {
    Exception exception = assertThrows(FeeCalculationException.class, () -> {
      new PercentageFeeStrategy(105);
    });
    assertEquals("Percentage cannot exceed 100%", exception.getMessage());
  }
}