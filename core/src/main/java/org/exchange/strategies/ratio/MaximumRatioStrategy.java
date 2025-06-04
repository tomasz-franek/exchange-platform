package org.exchange.strategies.ratio;

import jakarta.validation.constraints.NotNull;
import org.exchange.builders.CoreTicket;

public class MaximumRatioStrategy implements RatioStrategy {

  public long getRatio(final @NotNull CoreTicket buyTicket,
      final @NotNull CoreTicket sellTicket) {
    return Math.max(buyTicket.getRatio(), sellTicket.getRatio());
  }
}
