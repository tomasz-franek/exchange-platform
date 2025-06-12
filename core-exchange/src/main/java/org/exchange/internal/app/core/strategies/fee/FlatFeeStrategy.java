package org.exchange.internal.app.core.strategies.fee;

import org.exchange.internal.app.core.builders.CoreTicket;
import org.exchange.internal.app.core.exceptions.FeeCalculationException;


public class FlatFeeStrategy implements FeeCalculationStrategy {

  private final long flatFeeAmount;

  public FlatFeeStrategy(long flatFeeAmount) {
    if (flatFeeAmount < 0) {
      throw new FeeCalculationException("Flat fee amount cannot be negative");
    }
    this.flatFeeAmount = flatFeeAmount;
  }

  @Override
  public long calculateFee(CoreTicket coreTicket) {
    return flatFeeAmount;
  }
}
