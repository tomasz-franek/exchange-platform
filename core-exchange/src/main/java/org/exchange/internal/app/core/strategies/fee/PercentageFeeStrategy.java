package org.exchange.internal.app.core.strategies.fee;

import org.exchange.internal.app.core.exceptions.FeeCalculationException;

public class PercentageFeeStrategy implements FeeCalculationStrategy {

  public PercentageFeeStrategy() {
    this(0);
  }

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

  public PercentageFeeStrategy setPercentageFee(String percentageFee) {
    return new PercentageFeeStrategy(Double.parseDouble(percentageFee));
  }

  @Override
  public long calculateFee(long amount) {
    assert amount >= 0;
    double calculatedFee = amount * percentageFee;
    calculatedFee /= 100;
    return (long) calculatedFee;
  }
}
