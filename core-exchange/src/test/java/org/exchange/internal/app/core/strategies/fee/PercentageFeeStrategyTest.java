package org.exchange.internal.app.core.strategies.fee;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.exchange.internal.app.core.exceptions.FeeCalculationException;
import org.junit.jupiter.api.Test;

class PercentageFeeStrategyTest {

  @Test
  void constructor_when_valuePercentageFeePositive_then_strategyInitialized() {
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(10);
    assertNotNull(strategy);
  }

  @Test
  void constructor_when_zeroPercentageFeePositive_then_strategyInitialized() {
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(0);
    assertNotNull(strategy);
  }

  @Test
  void constructor_when_MaximumPercentageFeePositive_then_strategyInitialized() {
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(100);
    assertNotNull(strategy);
  }

  @Test
  void testCalculateFeeWithValidAmount() {
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(10);
    assertEquals(20, strategy.calculateFee(200));
  }

  @Test
  void calculateFee_when_coreTicketZeroAmount_then_feeSouldBeZero() {
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(15);
    assertEquals(0, strategy.calculateFee(0));
  }

  @Test
  void calculateFee_when_negativePercentageFee_then_generatedException() {
    Exception exception = assertThrows(FeeCalculationException.class, () -> {
      new PercentageFeeStrategy(-5);
    });
    assertEquals("Percentage cannot be negative", exception.getMessage());
  }

  @Test
  void calculateFee_when_exceedingMaximumPercentage_then_generatedException() {
    Exception exception = assertThrows(FeeCalculationException.class, () -> {
      new PercentageFeeStrategy(105);
    });
    assertEquals("Percentage cannot exceed 100%", exception.getMessage());
  }
}