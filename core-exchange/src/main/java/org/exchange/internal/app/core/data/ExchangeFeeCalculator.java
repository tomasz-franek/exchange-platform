package org.exchange.internal.app.core.data;

import jakarta.validation.constraints.NotNull;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.internal.api.model.ExchangeTicket;

@Log4j2
public class ExchangeFeeCalculator {

  private static final long MINIMUM_TRANSACTION_FEE = 100;
  private static final long ONE_PERCENT = 1_0000L;


  public static long calculateTransactionFee(final @NotNull ExchangeFee exchangeFee) {

    long calculatedFeeValue = 0L;
    exchangeFee.setFeeCalculationTimeUTC(-1);
    exchangeFee.setFeeAmount(-1);

    if (validate(exchangeFee)) {

      for (final ExchangeTicket exchangeTicket : exchangeFee.getOrderSummary()
          .getExchangeTicketList()) {
        if (null == exchangeTicket || null == exchangeTicket.getAmount()) {
          return -1;
        }
        calculatedFeeValue += exchangeTicket.getAmount();
      }

      if (calculatedFeeValue <= 0) {
        return -1;
      }
      try {
        calculatedFeeValue = calculatedFeeValue * exchangeFee.getFeePercent();
        calculatedFeeValue = calculatedFeeValue / ONE_PERCENT;
        if (calculatedFeeValue < MINIMUM_TRANSACTION_FEE
            && exchangeFee.getFeePercent() > 0) {
          calculatedFeeValue = MINIMUM_TRANSACTION_FEE;
        }
        exchangeFee.setFeeCalculationTimeUTC(ExchangeDateUtils.currentEpochUtc());
        exchangeFee.setFeeAmount(calculatedFeeValue);

      } catch (Exception e) {
        log.error("calculateTransactionFee ", e);
        return -1;
      }
    }
    return calculatedFeeValue;
  }

  private static boolean validate(ExchangeFee exchangeFee) {

    if (null == exchangeFee.getOrderSummary().getExchangeTicketList()
        || exchangeFee.getOrderSummary()
        .getExchangeTicketList().isEmpty()) {
      return false;
    }

    return exchangeFee.getFeePercent() >= 0;
  }
}
