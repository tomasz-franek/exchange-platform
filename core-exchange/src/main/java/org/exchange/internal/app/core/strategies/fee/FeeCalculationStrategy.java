package org.exchange.internal.app.core.strategies.fee;

import jakarta.validation.constraints.NotNull;

public interface FeeCalculationStrategy {

  long calculateFee(final @NotNull long amount);
}
