package org.exchange.stategies;

import jakarta.validation.constraints.NotNull;
import org.exchange.builders.CoreTicket;

public class MaximumRatioStrategy implements RatioStrategy {

  public long getRatio(final @NotNull CoreTicket orderTicket,
      final @NotNull CoreTicket oppositeTicket) {
    return Math.max(orderTicket.getRatio(), oppositeTicket.getRatio());
  }
}
