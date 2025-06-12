package org.exchange.internal.app.core.strategies.fee;

import org.exchange.internal.app.core.builders.CoreTicket;

public class ZeroFeeStrategy implements FeeCalculationStrategy {

  @Override
  public long calculateFee(CoreTicket coreTicket) {
    return 0;
  }
}
