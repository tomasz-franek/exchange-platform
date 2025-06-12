package org.exchange.internal.app.core.strategies.fee;

import jakarta.validation.constraints.NotNull;
import org.exchange.internal.app.core.builders.CoreTicket;

public interface FeeCalculationStrategy {

  long calculateFee(final @NotNull CoreTicket coreTicket);
}
