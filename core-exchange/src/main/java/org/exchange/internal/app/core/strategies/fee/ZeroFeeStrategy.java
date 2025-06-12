package org.exchange.internal.app.core.strategies.fee;

public class ZeroFeeStrategy implements FeeCalculationStrategy {

  @Override
  public long calculateFee(long amount) {
    return 0;
  }
}
