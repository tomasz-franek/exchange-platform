package org.exchange.internal.app.core.data;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@ToString
public class ExchangeFee {

  private final OrderSummary orderSummary;
  private final long feePercent;
  @Setter
  private long feeCalculationTimeUTC;
  @Setter
  private long feeAmount;

  public ExchangeFee(final @NotNull OrderSummary orderSummary,
      final @NotNull long feePercent) {
    this.orderSummary = orderSummary;
    this.feePercent = feePercent;
  }
}
