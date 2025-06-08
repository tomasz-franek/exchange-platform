package org.exchange.strategies.fee;

import jakarta.validation.constraints.NotNull;
import org.exchange.builders.CoreTicket;

public interface FeeCalculationStrategy {

  long calculateFee(final @NotNull CoreTicket coreTicket);
}
