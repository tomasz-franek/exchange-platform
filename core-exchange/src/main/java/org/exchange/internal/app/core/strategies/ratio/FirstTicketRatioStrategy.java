package org.exchange.internal.app.core.strategies.ratio;

import jakarta.validation.constraints.NotNull;
import org.exchange.internal.app.core.builders.CoreTicket;

public class FirstTicketRatioStrategy implements RatioStrategy {

  //Return ratio for lowest CoreTicket id
  public long getRatio(final @NotNull CoreTicket buyTicket,
      final @NotNull CoreTicket sellTicket) {
    return buyTicket.getId() < sellTicket.getId() ? buyTicket.getRatio()
        : sellTicket.getRatio();
  }
}
