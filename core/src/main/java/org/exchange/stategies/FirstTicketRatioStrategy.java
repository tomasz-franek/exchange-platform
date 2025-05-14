package org.exchange.stategies;

import jakarta.validation.constraints.NotNull;
import org.exchange.builders.CoreTicket;

public class FirstTicketRatioStrategy implements RatioStrategy {

  //Return ratio for lowest CoreTicket id
  public long getRatio(final @NotNull CoreTicket orderTicket,
      final @NotNull CoreTicket oppositeTicket) {
    return orderTicket.getId() < oppositeTicket.getId() ? orderTicket.getRatio()
        : oppositeTicket.getRatio();
  }
}
