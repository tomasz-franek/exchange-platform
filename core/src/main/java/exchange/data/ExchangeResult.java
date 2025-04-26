package exchange.data;

import exchange.app.api.model.Direction;
import exchange.app.api.model.ExchangeTicket;
import exchange.app.api.model.OrderTicket;
import exchange.exceptions.ExchangeException;
import lombok.Getter;
import lombok.Setter;
import lombok.extern.log4j.Log4j2;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.ZoneOffset;


@Getter
@Log4j2
public final class ExchangeResult {

    private static final BigDecimal ONE_CENT = new BigDecimal("0.0100");
    private static final int FOUR_DIGIT = 4;
    private static final MathContext FOUR_DIGIT_HUP = new MathContext(FOUR_DIGIT, RoundingMode.HALF_UP);
    @Setter
    private OrderTicket orderTicket;
    @Setter
    private OrderTicket oppositeTicket;
    @Setter
    private OrderTicket orderTicketAfterExchange = null;
    @Setter
    private OrderTicket oppositeTicketAfterExchange = null;
    @Setter
    private ExchangeTicket oppositeExchange = null;
    @Setter
    private ExchangeTicket orderExchange = null;
    private final LocalDateTime exchangeTimeUTC;

    public ExchangeResult(final OrderTicket orderTicket, final OrderTicket oppositeTicket,
                          final LocalDateTime exchangeTimeUTC) {
        this.exchangeTimeUTC = exchangeTimeUTC;
        this.orderTicket = orderTicket;
        this.oppositeTicket = oppositeTicket;
    }

    public ExchangeResult(final OrderTicket orderTicket, final OrderTicket oppositeTicket) {
        this.orderTicket = orderTicket;
        this.oppositeTicket = oppositeTicket;
        this.exchangeTimeUTC = LocalDateTime.now(ZoneOffset.UTC);
    }

    private void checkTicketAndTicketAfterExchange(final OrderTicket ticket, final OrderTicket ticketAfterExchange)
            throws ExchangeException {
        if (ticket.getPair() != ticketAfterExchange.getPair()) {
            throw new ExchangeException(
                    String.format("Invalid orderTicketAfterExchange currency : '%s' should be '%s'", ticket.getPair(),
                            ticketAfterExchange.getPair()));
        }
        if (!ticket.getRatio().equals(ticketAfterExchange.getRatio())) {
            throw new ExchangeException(
                    String.format("Invalid orderTicketAfterExchange exchange ratio : '%s' should be '%s'",
                            ticket.getRatio(), ticketAfterExchange.getRatio()));
        }
        if (ticket.getDirection() != ticketAfterExchange.getDirection()) {
            throw new ExchangeException(
                    String.format("Invalid orderTicketAfterExchange exchange A->B : '%s' should be '%s'",
                            ticket.getDirection(), ticketAfterExchange.getDirection()));
        }
    }

    public boolean validate() throws ExchangeException {

        if (oppositeTicket == null || orderTicket == null || oppositeExchange == null || orderExchange == null) {
            return false;
        }

        if (!Direction.BUY.equals(orderTicket.getDirection())) {
            return false;
        }

        if (Direction.BUY.equals(oppositeTicket.getDirection())) {
            return false;
        }

        if (orderTicketAfterExchange != null) {
            checkTicketAndTicketAfterExchange(orderTicket, orderTicketAfterExchange);
        }

        if (oppositeTicketAfterExchange != null) {
            checkTicketAndTicketAfterExchange(oppositeTicket, oppositeTicketAfterExchange);
        }

        validatePair();
        validateDirection();
        validateRatio();
        validateIDs();
        validateValueAmount();
        validateCurrency();

        return fastValidate();
    }

    private void validatePair() throws ExchangeException {
        if (!orderTicket.getPair().equals(oppositeTicket.getPair())) {
            throw new ExchangeException(
                    String.format("Invalid Currency symbol for opposite order ticket : '%s' opposite order : '%s'",
                            orderTicket.getPair(), oppositeTicket));
        }
    }

    private void validateRatio() throws ExchangeException {
        if (!orderExchange.getRatio().equals(oppositeExchange.getRatio())) {
            throw new ExchangeException(
                    String.format("Invalid ratios for exchange order ticket : '%s' opposite exchange: '%s'",
                            orderExchange.getRatio(), oppositeExchange.getRatio()));
        }
    }

    private void validateCurrency() throws ExchangeException {
        if (orderTicket.getIdCurrency().equalsIgnoreCase(orderExchange.getIdCurrency())) {
            throw new ExchangeException(String.format("Invalid currency id : orderTicket '%s' orderExchange: '%s'",
                    orderTicket.getIdCurrency(), orderExchange.getIdCurrency()));
        }
        if (oppositeTicket.getIdCurrency().equalsIgnoreCase(oppositeExchange.getIdCurrency())) {
            throw new ExchangeException(
                    String.format("Invalid currency id : oppositeTicket '%s' oppositeExchange: '%s'",
                            oppositeTicket.getIdCurrency(), oppositeExchange.getIdCurrency()));
        }
    }

    private void validateValueAmount() throws ExchangeException {
        BigDecimal exchange = oppositeExchange.getValueAmount();
        if (!orderTicket.getValueAmount().subtract(orderTicketAfterExchange.getValueAmount())
                .setScale(2, RoundingMode.FLOOR).equals(exchange.setScale(2, RoundingMode.FLOOR))) {
            throw new ExchangeException(String.format(
                    "Invalid amount : orderTicket '%s' orderTicketAfterExchange: '%s'  oppositeExchange: '%s'",
                    orderTicket.getValueAmount(), orderTicketAfterExchange.getValueAmount(), exchange));
        }

        exchange = orderExchange.getValueAmount();
        if (!oppositeTicket.getValueAmount().subtract(oppositeTicketAfterExchange.getValueAmount())
                .setScale(2, RoundingMode.FLOOR).equals(exchange.setScale(2, RoundingMode.FLOOR))) {
            throw new ExchangeException(String.format(
                    "Invalid amount : oppositeTicket '%s' oppositeTicketAfterExchange: '%s'  orderExchange: '%s'",
                    oppositeTicket.getValueAmount(), oppositeTicketAfterExchange.getValueAmount(), exchange));
        }
    }

    private void validateIDs() throws ExchangeException {
        if (!orderTicket.getId().equals(orderTicketAfterExchange.getId())) {
            throw new ExchangeException(
                    String.format("Invalid ticket ids : '%s' orderTicketAfterExchange: '%s'", orderTicket.getId(),
                            orderTicketAfterExchange.getId()));
        }

        if (!oppositeTicket.getId().equals(oppositeTicketAfterExchange.getId())) {
            throw new ExchangeException(
                    String.format("Invalid ticket ids : '%s' oppositeTicketAfterExchange: '%s'", oppositeTicket.getId(),
                            oppositeTicketAfterExchange.getId()));
        }

        if (orderExchange.getId().equals(orderExchange.getIdOrderReverse())) {
            throw new ExchangeException(
                    String.format("Invalid ticket ids : '%s' idOrderReverse: '%s'", orderExchange.getId(),
                            orderExchange.getIdOrderReverse()));
        }

        if (!orderTicket.getId().equals(orderExchange.getId())) {
            throw new ExchangeException(
                    String.format("Invalid ticket ids : '%s' id: '%s'", orderTicket.getId(), orderExchange.getId()));
        }
        if (!oppositeTicket.getId().equals(oppositeExchange.getId())) {
            throw new ExchangeException(String.format("Invalid ticket ids : '%s' id: '%s'", oppositeTicket.getId(),
                    oppositeExchange.getId()));
        }
    }

    private void validateDirection() throws ExchangeException {
        if (orderTicket.getDirection().equals(oppositeTicket.getDirection())) {
            throw new ExchangeException(
                    String.format("Invalid exchange A-B for opposite order ticket : '%s' opposite order : '%s'",
                            orderTicket.getPair(), oppositeTicket));
        }

        if (orderTicket.getDirection().equals(orderExchange.getDirection())) {
            throw new ExchangeException(
                    String.format("Invalid exchange A-B for opposite order ticket : '%s' order exchange: '%s'",
                            orderTicket.getDirection(), orderExchange.getDirection()));
        }

        if (oppositeTicket.getDirection().equals(oppositeExchange.getDirection())) {
            throw new ExchangeException(
                    String.format("Invalid exchange A-B for opposite opposite ticket : '%s' opposite exchange: '%s'",
                            oppositeTicket.getDirection(), oppositeExchange.getDirection()));
        }
    }

    public boolean fastValidate() throws ExchangeException {

        assert (Direction.BUY.equals(orderTicket.getDirection()));
        BigDecimal orderValueAmount = orderExchange.getValueAmount().multiply(orderExchange.getRatio());

        BigDecimal oppositeOrderValueAmount = oppositeExchange.getValueAmount();

        BigDecimal orderDifference = oppositeOrderValueAmount.subtract(orderValueAmount);
        orderDifference = orderDifference.abs();
        orderDifference = orderDifference.round(FOUR_DIGIT_HUP);

        final BigDecimal maxExchangeError = ONE_CENT.multiply(orderExchange.getRatio(), FOUR_DIGIT_HUP);
        if (maxExchangeError.doubleValue() < orderDifference.doubleValue()) {
            log.error(String.format("%s", orderDifference.doubleValue()));
            log.error(orderExchange.toString());
            log.error(oppositeExchange.toString());
            throw new ExchangeException("Invalid validate transaction orderValueAmount :" + orderDifference);
        }
        return true;
    }

    @Override
    public String toString() {
        String result;
        if (orderTicket == null) {
            result = "OrderTicket is null";
        } else {
            result = String.format("%s %s -> %s %s\n", orderTicket.getPair(), orderTicket.toString(),
                    oppositeTicket.getValueAmount(), oppositeTicket.getIdCurrency()) + "orderTicket" + orderTicket
                    + "oppositeTicket" + oppositeTicket;
        }
        return result;
    }
}
