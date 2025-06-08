package org.exchange.strategies.fee;

import org.exchange.builders.CoreTicket;

public class ZeroFeeStrategy implements FeeCalculationStrategy {

  @Override
  public long calculateFee(CoreTicket coreTicket) {
    return 0;
  }
}
