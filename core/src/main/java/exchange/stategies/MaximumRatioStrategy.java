package exchange.stategies;

import exchange.builders.CoreTicket;
import jakarta.validation.constraints.NotNull;

public class MaximumRatioStrategy implements RatioStrategy {

  public long getRatio(final @NotNull CoreTicket orderTicket,
      final @NotNull CoreTicket oppositeTicket) {
    return Math.max(orderTicket.getRatio(), oppositeTicket.getRatio());
  }
}
