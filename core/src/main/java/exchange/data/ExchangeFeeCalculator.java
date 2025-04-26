package exchange.data;

import exchange.app.api.model.ExchangeTicket;
import jakarta.validation.constraints.NotNull;
import lombok.extern.log4j.Log4j2;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;

@Log4j2
public class ExchangeFeeCalculator {

    private static final BigDecimal MINIMUM_TRANSACTION_FEE = new BigDecimal("0.01");
    private static final BigDecimal ONE_PERCENT = new BigDecimal("0.01");


    public static BigDecimal calculateTransactionFee(final @NotNull ExchangeFee exchangeFee) {

        BigDecimal calculatedFeeValue = BigDecimal.ZERO;
        exchangeFee.setFeeTime(null);
        exchangeFee.setFeeValue(null);

        if (validate(exchangeFee)) {


            for (final ExchangeTicket exchangeTicket : exchangeFee.getOrderSummary().getExchangeTicketList()) {
                if (null == exchangeTicket.getValueAmount()) {
                    return null;
                }
                calculatedFeeValue = calculatedFeeValue.add(exchangeTicket.getValueAmount());
            }

            if (calculatedFeeValue.compareTo(BigDecimal.ZERO) <= 0) {
                return null;
            }
            try {
                calculatedFeeValue = calculatedFeeValue.multiply(exchangeFee.getFeeDefinition());
                calculatedFeeValue = calculatedFeeValue.multiply(ONE_PERCENT);
                if (calculatedFeeValue.compareTo(MINIMUM_TRANSACTION_FEE) < 0
                        && exchangeFee.getFeeDefinition().compareTo(BigDecimal.ZERO) > 0) {
                    calculatedFeeValue = MINIMUM_TRANSACTION_FEE;
                } else {
                    calculatedFeeValue = calculatedFeeValue.setScale(2, RoundingMode.HALF_UP);
                }
                exchangeFee.setFeeTime(new Date());
                exchangeFee.setFeeValue(calculatedFeeValue);

            } catch (Exception e) {
                log.error("calculateTransactionFee ", e);
                return null;
            }
        }
        return calculatedFeeValue;
    }

    private static boolean validate(ExchangeFee exchangeFee) {

        if (null == exchangeFee.getOrderSummary().getExchangeTicketList() || exchangeFee.getOrderSummary()
                .getExchangeTicketList().isEmpty()) {
            return false;
        }

        return exchangeFee.getFeeDefinition().compareTo(BigDecimal.ZERO) >= 0;
    }
}
