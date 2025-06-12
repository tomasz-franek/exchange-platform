package org.exchange.internal.app.core.strategies.fee;

import org.exchange.internal.app.core.builders.CoreTicket;
import org.exchange.internal.app.core.exceptions.FeeCalculationException;

public class PercentageFeeStrategy implements FeeCalculationStrategy {

  private final double percentageFee;

  public PercentageFeeStrategy(double percentageFee) {
    if (percentageFee < 0) {
      throw new FeeCalculationException("Percentage cannot be negative");
    }
    if (percentageFee > 100) {
      throw new FeeCalculationException("Percentage cannot exceed 100%");
    }
    this.percentageFee = percentageFee;
  }

  @Override
  public long calculateFee(CoreTicket coreTicket) {
    assert coreTicket.getAmount() >= 0;
    double calculatedFee = coreTicket.getAmount() * percentageFee;
    calculatedFee /= 100;
    return (long) calculatedFee;
  }
}
