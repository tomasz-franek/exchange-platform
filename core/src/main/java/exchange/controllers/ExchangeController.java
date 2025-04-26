package exchange.controllers;

import exchange.app.api.model.Direction;
import exchange.app.api.model.ExchangeTicket;
import exchange.app.api.model.OrderTicket;
import exchange.app.api.model.Pair;
import exchange.builders.ExchangeTicketBuilder;
import exchange.builders.OrderTicketBuilder;
import exchange.data.BookOrderMap;
import exchange.data.ExchangeResult;
import exchange.data.SamePriceOrderList;
import exchange.exceptions.ExchangeException;
import exchange.utils.OrderUtils;
import jakarta.validation.constraints.NotNull;
import lombok.extern.log4j.Log4j2;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.InvalidParameterException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Log4j2
public final class ExchangeController {

    private final BookOrderMap bookOrder;

    public ExchangeController(final Pair currencyChange) {

        bookOrder = new BookOrderMap(currencyChange);
    }

    public boolean addOrderTicket(final @NotNull OrderTicket ticket) throws ExchangeException {

        return bookOrder.addOrderTicket(ticket, false);
    }

    public int getBookOrderCount(Direction directionEnum) {

        return bookOrder.getPriceOrdersListSize(directionEnum);
    }

    public BigDecimal getExchangeRatio(final @NotNull OrderTicket orderTicket,
                                       final @NotNull OrderTicket oppositeTicket) {

        BigDecimal returnValue = null;
        switch (orderTicket.getRatio().compareTo(oppositeTicket.getRatio())) {
            case 0:
                returnValue = orderTicket.getRatio();
                break;
            case 1:
                returnValue = getRatio(orderTicket, oppositeTicket);
                break;
            case -1:
                break;
            default:
                throw new InvalidParameterException(
                        "compareTo invalid value : " + orderTicket.getRatio().compareTo(oppositeTicket.getRatio()));
        }
        return returnValue;
    }

    private BigDecimal getRatio(@NotNull OrderTicket orderTicket, @NotNull OrderTicket oppositeTicket) {
        BigDecimal returnValue;
        if (orderTicket.getTicketDateUTC().equals(oppositeTicket.getTicketDateUTC())) {
            if (orderTicket.getId() < oppositeTicket.getId()) {
                returnValue = orderTicket.getRatio();
            } else {
                returnValue = oppositeTicket.getRatio();
            }
        } else {
            if (orderTicket.getTicketDateUTC().equals(oppositeTicket.getTicketDateUTC())) {
                returnValue = orderTicket.getRatio();
            } else {
                returnValue = oppositeTicket.getRatio();
            }
        }
        return returnValue;
    }

    private BigDecimal getExchangeValueAmount(final @NotNull OrderTicket orderTicket,
                                              final @NotNull BigDecimal exchangeRatio) {
        if (Direction.BUY.equals(orderTicket.getDirection())) {
            return orderTicket.getValueAmount().divide(exchangeRatio, 2, RoundingMode.FLOOR);
        } else {
            return orderTicket.getValueAmount();
        }
    }

    public ExchangeResult doExchange() throws ExchangeException {

        OrderTicket orderTicket = bookOrder.getFirstElement(Direction.BUY);
        OrderTicket oppositeTicket = bookOrder.getFirstElement(Direction.SELL);

        if (orderTicket == null || oppositeTicket == null) {
            return null;
        }

        BigDecimal orderExchangeRatio = getExchangeRatio(orderTicket, oppositeTicket);

        if (orderExchangeRatio == null) {
            return null;
        }
        if (log.isDebugEnabled()) {
            log.debug("Start do exchange ");
            log.debug(orderTicket.toString());
            log.debug(oppositeTicket.toString());
        }

        removeTicket(orderTicket);
        removeTicket(oppositeTicket);

        final LocalDateTime exchangeDateUTC = LocalDateTime.now(ZoneOffset.UTC);

        BigDecimal oppositeAmount = getExchangeValueAmount(oppositeTicket, orderExchangeRatio);
        BigDecimal orderAmount = getExchangeValueAmount(orderTicket, orderExchangeRatio);

        BigDecimal oppositeExchangeAmount = BigDecimal.valueOf(
                Math.min(orderAmount.doubleValue(), oppositeAmount.doubleValue()));
        BigDecimal orderExchangeAmount = oppositeExchangeAmount.multiply(orderExchangeRatio);
        orderExchangeAmount = orderExchangeAmount.setScale(2, RoundingMode.FLOOR);


        ExchangeResult result = new ExchangeResult(orderTicket, oppositeTicket);

        result.setOrderExchange(
                prepareExchangeTicket(orderTicket, oppositeTicket, orderExchangeRatio, oppositeExchangeAmount,
                        exchangeDateUTC));
        result.setOppositeExchange(
                prepareExchangeTicket(oppositeTicket, orderTicket, orderExchangeRatio, orderExchangeAmount,
                        exchangeDateUTC));


        result.setOrderTicketAfterExchange(
                prepareOrderTicketAfterExchange(orderTicket, oppositeTicket, orderExchangeAmount, exchangeDateUTC));
        result.setOppositeTicketAfterExchange(
                prepareOrderTicketAfterExchange(oppositeTicket, orderTicket, oppositeExchangeAmount, exchangeDateUTC));

        bookOrder.checkIfFinishOrder(Direction.BUY, orderTicket, result.getOrderTicketAfterExchange());
        bookOrder.checkIfFinishOrder(Direction.SELL, oppositeTicket, result.getOppositeTicketAfterExchange());

        result.fastValidate();
        if (log.isDebugEnabled()) {
            log.debug(result.toString());
            log.debug("Finish do exchange ");
        }
        return result;
    }

    private ExchangeTicket prepareExchangeTicket(OrderTicket orderTicket, OrderTicket oppositeTicket,
                                                 BigDecimal orderExchangeRatio, BigDecimal exchangeAmount,
                                                 LocalDateTime exchangeDateUTC) {
        return ExchangeTicketBuilder.createBuilder().withId(orderTicket.getId())
                .withIdOrderReverse(oppositeTicket.getId()).withDirection(oppositeTicket.getDirection())
                .withIdUser(orderTicket.getIdUser()).withPair(orderTicket.getPair()).withRatio(orderExchangeRatio)
                .withValueAmount(exchangeAmount).withExchangeDateUTC(exchangeDateUTC).buildExchangeTicket();
    }

    private void removeTicket(final OrderTicket orderTicket) throws ExchangeException {

        if (!bookOrder.removeFirstElement(orderTicket)) {
            throw new ExchangeException("Unable to remove ticket " + orderTicket.toString());
        }
    }

    private OrderTicket prepareOrderTicketAfterExchange(final OrderTicket orderTicket, final OrderTicket oppositeTicket,
                                                        BigDecimal orderExchange, final LocalDateTime exchangeDate) {

        OrderTicket orderTicketAfterExchange = createCopy(orderTicket);
        OrderUtils.split(orderTicketAfterExchange, orderExchange, exchangeDate, oppositeTicket.getId(),
                orderTicket.getPair());
        return orderTicketAfterExchange;
    }

    private OrderTicket createCopy(OrderTicket orderTicket) {
        return OrderTicketBuilder.createBuilder().withId(orderTicket.getId()).withIdUser(orderTicket.getIdUser())
                .withPair(orderTicket.getPair()).withDirection(orderTicket.getDirection())
                .withRatio(orderTicket.getRatio()).withValueAmount(orderTicket.getValueAmount())
                .withTicketDateUTC(orderTicket.getTicketDateUTC()).build();
    }


    public OrderTicket removeOrder(final Long id, final Direction direction) {

        return bookOrder.removeOrder(direction, id);
    }

    public void printStatus() {

        if (log.isDebugEnabled()) {
            for (Direction directionEnum : Direction.values()) {
                log.debug("order " + directionEnum.name());
                for (SamePriceOrderList elem : bookOrder.getPriceOrdersList(directionEnum)) {
                    log.debug(String.format("%s %s", elem.getRatio(), elem.size()));
                }
            }
        }
    }

    public void backOrderTicketToList(final OrderTicket ticket) throws ExchangeException {

        bookOrder.backOrderTicketToList(ticket);
    }

    public boolean removeCancelled(final OrderTicket ticket) throws ExchangeException {

        return bookOrder.removeCancelled(ticket);
    }

    public OrderTicket getFirstBookOrder(Direction direction) {

        return bookOrder.getFirstElement(direction);
    }

}
