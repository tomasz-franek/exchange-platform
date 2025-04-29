package exchange.controllers;

import exchange.app.api.model.Direction;
import exchange.app.api.model.Pair;
import exchange.builders.CoreTicket;
import exchange.builders.CoreTicketProperties;
import exchange.builders.ExchangeTicketBuilder;
import exchange.data.BookOrderMap;
import exchange.data.ExchangeResult;
import exchange.data.SamePriceOrderList;
import exchange.exceptions.ExchangeException;
import exchange.stategies.FirstTicketRatioStrategy;
import exchange.stategies.RatioStrategy;
import jakarta.validation.constraints.NotNull;
import java.security.InvalidParameterException;
import java.util.Calendar;
import java.util.TimeZone;
import lombok.extern.log4j.Log4j2;

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

  public int getBookOrderCount(Direction directionEnum) {

    return bookOrder.getPriceOrdersListSize(directionEnum);
  }

  public long getExchangeValue(final @NotNull CoreTicket orderTicket,
      final @NotNull long exchangeRatio) {
    if (Direction.BUY.equals(orderTicket.getDirection())) {
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
    assert orderTicket.getDirection() == Direction.BUY;
    assert oppositeTicket.getDirection() == Direction.SELL;
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

    CoreTicket orderTicket = bookOrder.getFirstElement(Direction.BUY);
    CoreTicket oppositeTicket = bookOrder.getFirstElement(Direction.SELL);

    if (orderTicket == null || oppositeTicket == null) {
      return null;
    }

    if (log.isDebugEnabled()) {
      log.debug("Start do exchange ");
      log.debug(orderTicket.toString());
      log.debug(oppositeTicket.toString());
    }

    long orderExchangeRatio = getExchangeRatio(orderTicket, oppositeTicket);
    if (orderExchangeRatio == 0) {
      return null;
    }

    removeTicket(orderTicket);
    removeTicket(oppositeTicket);

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
    bookOrder.checkIfFinishedOrder(Direction.BUY, orderTicket,
        result.getOrderTicketAfterExchange());
    bookOrder.checkIfFinishedOrder(Direction.SELL, oppositeTicket,
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
        .withValueAmount(exchangeAmount)
        .withEpochUTC(epochUTC).build();
  }

  private void removeTicket(final CoreTicket orderTicket) throws ExchangeException {

    if (!bookOrder.removeFirstElement(orderTicket)) {
      throw new ExchangeException("Unable to remove ticket " + orderTicket.toString());
    }
  }

  private CoreTicket prepareOrderTicketAfterExchange(final CoreTicket orderTicket,
      final CoreTicket oppositeTicket,
      long orderExchangeValue, long epochUTC) {
    return orderTicket.newValue(orderTicket.getValue() - orderExchangeValue, epochUTC,
        oppositeTicket.getId());
  }


  public CoreTicket removeOrder(final Long id, final Direction direction) {

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

  public void backOrderTicketToList(final CoreTicket ticket) throws ExchangeException {

    bookOrder.backOrderTicketToList(ticket);
  }

  public boolean removeCancelled(final CoreTicket ticket) throws ExchangeException {

    return bookOrder.removeCancelled(ticket);
  }

  public CoreTicket getFirstBookOrder(Direction direction) {

    return bookOrder.getFirstElement(direction);
  }

}
