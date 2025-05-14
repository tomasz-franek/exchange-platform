package org.exchange.controllers;

import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Direction.SELL;

import jakarta.validation.constraints.NotNull;
import java.security.InvalidParameterException;
import java.util.Calendar;
import java.util.TimeZone;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.ObjectUtils;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.exchange.builders.CoreTicket;
import org.exchange.builders.CoreTicketProperties;
import org.exchange.builders.ExchangeTicketBuilder;
import org.exchange.data.BookOrderMap;
import org.exchange.data.ExchangeResult;
import org.exchange.data.SamePriceOrderList;
import org.exchange.exceptions.ExchangeException;
import org.exchange.stategies.FirstTicketRatioStrategy;
import org.exchange.stategies.RatioStrategy;

@Log4j2
public final class ExchangeController {

  private final BookOrderMap bookOrder;
  private final RatioStrategy ratioStrategy = new FirstTicketRatioStrategy();

  public ExchangeController(final Pair currencyChange) {

    bookOrder = new BookOrderMap(currencyChange);
  }

  public boolean addCoreTicket(final @NotNull CoreTicket ticket) throws ExchangeException {

    return bookOrder.addTicket(ticket, false);
  }

  public int getBookOrderCount(Direction direction) {

    return bookOrder.getPriceOrdersListSize(direction);
  }

  public int getTotalTicketOrders(Direction direction) {
    return bookOrder.getTotalTicketOrders(direction);
  }

  public long getExchangeValue(final @NotNull CoreTicket orderTicket,
      final @NotNull long exchangeRatio) {
    if (BUY.equals(orderTicket.getDirection())) {
      double result = orderTicket.getValue();
      result /= exchangeRatio;
      result *= CoreTicketProperties.ROUNDING;
      return (long) result;
    } else {
      return orderTicket.getValue();
    }
  }

  public long getEpochUTC() {
    Calendar calendar = Calendar.getInstance();
    calendar.setTimeZone(TimeZone.getTimeZone("UTC"));
    return calendar.getTimeInMillis();
  }

  public long getExchangeValueAmount(CoreTicket orderTicket, CoreTicket oppositeTicket,
      long orderExchangeRatio) {
    assert BUY.equals(orderTicket.getDirection());
    assert SELL.equals(oppositeTicket.getDirection());
    long oppositeAmount = getExchangeValue(oppositeTicket, orderExchangeRatio);
    long orderAmount = getExchangeValue(orderTicket, orderExchangeRatio);

    return Math.min(orderAmount, oppositeAmount);
  }

  public long getExchangeRatio(final @NotNull CoreTicket orderTicket,
      final @NotNull CoreTicket oppositeTicket) {

    return switch (Long.compare(orderTicket.getRatio(), oppositeTicket.getRatio())) {
      case 0 -> orderTicket.getRatio();
      case 1 -> ratioStrategy.getRatio(orderTicket, oppositeTicket);
      case -1 -> 0;
      default -> throw new InvalidParameterException(
          "compareTo invalid value : " + Long.compare(orderTicket.getRatio(),
              oppositeTicket.getRatio()));
    };
  }

  public ExchangeResult doExchange() throws ExchangeException {

    CoreTicket orderTicket = bookOrder.getFirstElement(BUY);
    CoreTicket oppositeTicket = bookOrder.getFirstElement(SELL);

    if (ObjectUtils.anyNull(orderTicket, oppositeTicket)) {
      return null;
    }

    long orderExchangeRatio = getExchangeRatio(orderTicket, oppositeTicket);
    if (orderExchangeRatio == 0) {
      return null;
    }

    removeFirstElement(orderTicket);
    removeFirstElement(oppositeTicket);

    long epochUTC = getEpochUTC();

    long oppositeExchangeAmount = getExchangeValueAmount(orderTicket, oppositeTicket,
        orderExchangeRatio);
    double orderExchangeAmountDouble = oppositeExchangeAmount * orderExchangeRatio;
    orderExchangeAmountDouble /= CoreTicketProperties.ROUNDING;
    long orderExchangeAmount = (long) orderExchangeAmountDouble;

    ExchangeResult result = new ExchangeResult(orderTicket, oppositeTicket);

    result.setOrderExchange(
        prepareExchangeTicket(orderTicket, oppositeTicket, orderExchangeRatio,
            oppositeExchangeAmount,
            epochUTC));
    result.setOppositeExchange(
        prepareExchangeTicket(oppositeTicket, orderTicket, orderExchangeRatio, orderExchangeAmount,
            epochUTC));

    result.setOrderTicketAfterExchange(
        prepareOrderTicketAfterExchange(orderTicket, oppositeTicket, orderExchangeAmount,
            epochUTC));
    if (orderTicket.getValue() - orderExchangeAmount > CoreTicketProperties.ROUNDING) {
      orderTicket = orderTicket.newValue(orderTicket.getValue() - orderExchangeAmount,
          epochUTC);
      bookOrder.addTicket(orderTicket, true);
    }
    result.setOppositeTicketAfterExchange(
        prepareOrderTicketAfterExchange(oppositeTicket, orderTicket, oppositeExchangeAmount,
            epochUTC));
    if (oppositeTicket.getValue() - oppositeExchangeAmount > CoreTicketProperties.ROUNDING) {
      oppositeTicket = oppositeTicket.newValue(oppositeTicket.getValue() - oppositeExchangeAmount,
          epochUTC);
      if (oppositeTicket != null) {
        bookOrder.addTicket(oppositeTicket, true);
      }
    }
    bookOrder.addTicketToBookWhenNotFinished(orderTicket,
        result.getOrderTicketAfterExchange());
    bookOrder.addTicketToBookWhenNotFinished(oppositeTicket,
        result.getOppositeTicketAfterExchange());

    result.fastValidate();
    if (log.isDebugEnabled()) {
      log.debug(result.toString());
      log.debug("Finish do exchange ");
    }
    return result;
  }

  public CoreTicket prepareExchangeTicket(
      CoreTicket orderTicket,
      CoreTicket oppositeTicket,
      long orderExchangeRatio,
      long exchangeAmount,
      long epochUTC) {
    return ExchangeTicketBuilder.createBuilder().withId(orderTicket.getId())
        .withIdOrderReverse(oppositeTicket.getId()).withDirection(oppositeTicket.getDirection())
        .withPair(orderTicket.getPair())
        .withRatio(orderExchangeRatio)
        .withIdUser(orderTicket.getIdUser())
        .withValue(exchangeAmount)
        .withEpochUTC(epochUTC).build();
  }

  private void removeFirstElement(final CoreTicket orderTicket) throws ExchangeException {

    if (!bookOrder.removeFirstElement(orderTicket)) {
      throw new ExchangeException("Unable to remove ticket " + orderTicket.toString());
    }
  }

  private CoreTicket prepareOrderTicketAfterExchange(final CoreTicket orderTicket,
      final CoreTicket oppositeTicket, long orderExchangeValue, long epochUTC) {
    return orderTicket.newValue(orderTicket.getValue() - orderExchangeValue, epochUTC,
        oppositeTicket.getId());
  }


  public CoreTicket removeOrder(final Long id, final Direction direction) {

    return bookOrder.removeOrder(direction, id);
  }

  public void printStatus() {

    if (log.isDebugEnabled()) {
      for (Direction direction : Direction.values()) {
        log.debug("order {}", direction.name());
        for (SamePriceOrderList elem : bookOrder.getPriceOrdersList(direction)) {
          log.debug("{} {}", elem.getRatio(), elem.size());
        }
      }
    }
  }

  public void backOrderTicketToList(final CoreTicket ticket) throws ExchangeException {

    bookOrder.backOrderTicketToList(ticket);
  }

  public boolean removeCancelled(final CoreTicket ticket) throws ExchangeException {

    return bookOrder.removeCancelled(ticket);
  }

  public CoreTicket getFirstBookTicket(Direction direction) {

    return bookOrder.getFirstElement(direction);
  }

}
