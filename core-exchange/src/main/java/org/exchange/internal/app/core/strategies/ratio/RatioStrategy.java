package org.exchange.internal.app.core.strategies.ratio;

import jakarta.validation.constraints.NotNull;
import org.exchange.internal.app.core.builders.CoreTicket;

public interface RatioStrategy {

  long getRatio(final @NotNull CoreTicket buyTicket, final @NotNull CoreTicket sellTicket);
}
