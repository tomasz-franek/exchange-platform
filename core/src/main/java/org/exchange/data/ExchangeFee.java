package org.exchange.data;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@ToString
public class ExchangeFee {

  private final OrderSummary orderSummary;
  private final long feeDefinition;
  @Setter
  private long feeCalculationTimeUTC;
  @Setter
  private long feeValue;

  public ExchangeFee(final @NotNull OrderSummary orderSummary,
      final @NotNull long feeDefinition) {
    this.orderSummary = orderSummary;
    this.feeDefinition = feeDefinition;
  }
}
