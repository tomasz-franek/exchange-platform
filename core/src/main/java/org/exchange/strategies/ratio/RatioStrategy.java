package org.exchange.strategies.ratio;

import jakarta.validation.constraints.NotNull;
import org.exchange.builders.CoreTicket;

public interface RatioStrategy {

  long getRatio(final @NotNull CoreTicket orderTicket, final @NotNull CoreTicket oppositeTicket);
}
