package org.exchange.internal.app.core.strategies.ratio;

import jakarta.validation.constraints.NotNull;
import org.exchange.app.backend.common.builders.CoreTicket;

public interface RatioStrategy {

  long getRatio(final @NotNull CoreTicket buyTicket, final @NotNull CoreTicket sellTicket);
}
