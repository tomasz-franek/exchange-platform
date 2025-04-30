package exchange.stategies;

import exchange.builders.CoreTicket;
import jakarta.validation.constraints.NotNull;

public class FirstTicketRatioStrategy implements RatioStrategy {

  //Return ratio for lowest CoreTicket id
  public long getRatio(final @NotNull CoreTicket orderTicket,
      final @NotNull CoreTicket oppositeTicket) {
    return orderTicket.getId() < oppositeTicket.getId() ? orderTicket.getRatio()
        : oppositeTicket.getRatio();
  }
}
