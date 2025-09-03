package org.exchange.internal.app.core.strategies.fee;

import static org.exchange.app.backend.common.builders.CoreTicketProperties.MAX_EXCHANGE_ERROR;

import org.apache.logging.log4j.util.Strings;
import org.exchange.internal.app.core.exceptions.FeeCalculationException;

public class PercentageFeeStrategy implements FeeCalculationStrategy {

  public PercentageFeeStrategy() {
    this(0);
  }

  private final double percentageFee;

  public PercentageFeeStrategy(double percentageFee) {
    if (percentageFee < 0) {
      throw new FeeCalculationException("Percentage cannot be negative");
    }
    if (percentageFee > 100) {
      throw new FeeCalculationException("Percentage cannot exceed 100%");
    }
    this.percentageFee = percentageFee;
  }

  public PercentageFeeStrategy setPercentageFee(String percentageFee) {
    if (Strings.isBlank(percentageFee)) {
      throw new FeeCalculationException("Percentage Fee value is null or empty");
    }
    try {
      double percentage = Double.parseDouble(percentageFee);
      return new PercentageFeeStrategy(percentage);
    } catch (Exception exception) {
      throw new FeeCalculationException("Wrong Percentage Fee value : " + exception.getMessage());
    }
  }

  @Override
  public long calculateFee(long amount) {
    assert amount >= 0;
    double calculatedFee = amount * percentageFee;
    calculatedFee /= 100;
    long longCalculatedFee = (long) calculatedFee;
    if (amount > 0 && percentageFee > 0 && longCalculatedFee == 0) {
      longCalculatedFee = MAX_EXCHANGE_ERROR;
    }
    if (longCalculatedFee % MAX_EXCHANGE_ERROR > 0) {
      longCalculatedFee += MAX_EXCHANGE_ERROR - longCalculatedFee % MAX_EXCHANGE_ERROR;
    }

    return longCalculatedFee;
  }
}
