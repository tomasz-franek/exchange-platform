package org.exchange.strategies.ratio;

import jakarta.validation.constraints.NotNull;
import org.exchange.builders.CoreTicket;

public class AverageOrderRatioStrategy implements RatioStrategy {

  @Override
  //Return average ratio
  public long getRatio(final @NotNull CoreTicket buyTicket,
      final @NotNull CoreTicket sellTicket) {
    long ratio = buyTicket.getRatio() + sellTicket.getRatio();
    ratio >>= 1;
    return ratio;
  }
}
