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
    CoreTicket coreTicket = CoreTicketBuilder.createBuilder()
        .withId(1L).withAmount(200).withRatio(2).withPair(Pair.GBP_USD)
        .withUserId(UUID.randomUUID()).withDirection(Direction.SELL)
        .build();
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(10);
    assertEquals(20, strategy.calculateFee(coreTicket));
  }

  @Test
  void calculateFee_when_coreTicketZeroAmount_then_feeSouldBeZero() {
    CoreTicket coreTicket = CoreTicketBuilder.createBuilder()
        .withId(1L).withAmount(0).withRatio(2).withPair(Pair.EUR_GBP)
        .withUserId(UUID.randomUUID()).withDirection(Direction.SELL)
        .build();
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(15);
    assertEquals(0, strategy.calculateFee(coreTicket));
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

  @Test
  void calculateFee_when_nullCoreTicket_then_generatedException() {
    PercentageFeeStrategy strategy = new PercentageFeeStrategy(10);
    assertThrows(NullPointerException.class, () -> {
      strategy.calculateFee(null);
    });
  }
}