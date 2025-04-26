package exchange.utils;

import exchange.app.api.model.ExchangeTicket;
import exchange.app.api.model.OrderTicket;
import exchange.app.api.model.Pair;
import exchange.builders.ExchangeTicketBuilder;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderUtils {
    public static ExchangeTicket split(OrderTicket orderTicketAfterExchange, final BigDecimal valueToSplit,
                                       final LocalDateTime exchangeDate, final Long idOrderReverse, final Pair pair) {
        BigDecimal valueAfterSplit;
        valueAfterSplit = orderTicketAfterExchange.getValueAmount().subtract(valueToSplit);
        if (valueAfterSplit.compareTo(BigDecimal.ZERO) >= 0) {
            orderTicketAfterExchange.setValueAmount(valueAfterSplit);
            return ExchangeTicketBuilder.createBuilder().withId(orderTicketAfterExchange.getId())
                    .withIdOrderReverse(idOrderReverse).withIdUser(orderTicketAfterExchange.getIdUser()).withPair(pair)
                    .withDirection(orderTicketAfterExchange.getDirection())
                    .withRatio(orderTicketAfterExchange.getRatio()).withValueAmount(valueToSplit)
                    .withExchangeDateUTC(exchangeDate).buildExchangeTicket();

        } else {
            throw new ArithmeticException("Invalid data for split");
        }
    }
}
