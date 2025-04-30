package exchange.stategies;

import exchange.builders.CoreTicket;
import jakarta.validation.constraints.NotNull;

public class AverageOrderRatioStrategy implements RatioStrategy {

  @Override
  //Return average ratio
  public long getRatio(final @NotNull CoreTicket orderTicket,
      final @NotNull CoreTicket oppositeTicket) {
    long ratio = orderTicket.getRatio() + oppositeTicket.getRatio();
    ratio >>= 1;
    return ratio;
  }
}
