package org.exchange.strategies.ratio;

import jakarta.validation.constraints.NotNull;
import org.exchange.builders.CoreTicket;

public class MinimumRatioStrategy implements RatioStrategy {

  public long getRatio(final @NotNull CoreTicket orderTicket,
      final @NotNull CoreTicket oppositeTicket) {
    return Math.min(orderTicket.getRatio(), oppositeTicket.getRatio());
  }
}
