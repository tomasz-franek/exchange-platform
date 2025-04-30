package exchange.stategies;

import exchange.builders.CoreTicket;
import jakarta.validation.constraints.NotNull;

public class MinimumRatioStrategy implements RatioStrategy {

  public long getRatio(final @NotNull CoreTicket orderTicket,
      final @NotNull CoreTicket oppositeTicket) {
    return Math.min(orderTicket.getRatio(), oppositeTicket.getRatio());
  }
}
