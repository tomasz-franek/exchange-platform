package org.exchange.stategies;

import jakarta.validation.constraints.NotNull;
import org.exchange.builders.CoreTicket;

public interface RatioStrategy {

  long getRatio(final @NotNull CoreTicket orderTicket, final @NotNull CoreTicket oppositeTicket);
}
