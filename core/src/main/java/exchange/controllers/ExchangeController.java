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
import exchange.utils.OrderUtils;
import jakarta.validation.constraints.NotNull;
import java.security.InvalidParameterException;
import java.util.Calendar;
import java.util.TimeZone;
import lombok.extern.log4j.Log4j2;

@Log4j2
public final class ExchangeController {

  private final BookOrderMap bookOrder;

  public ExchangeController(final Pair currencyChange) {

    bookOrder = new BookOrderMap(currencyChange);
  }

  public boolean addOrderTicket(final @NotNull CoreTicket ticket) throws ExchangeException {

    return bookOrder.addOrderTicket(ticket, false);
  }

  public int getBookOrderCount(Direction directionEnum) {

    return bookOrder.getPriceOrdersListSize(directionEnum);
  }

  public long getExchangeRatio(final @NotNull CoreTicket orderTicket,
      final @NotNull CoreTicket oppositeTicket) {

    return switch (Long.compare(orderTicket.getRatio(), oppositeTicket.getRatio())) {
      case 0 -> orderTicket.getRatio();
      case 1 -> getRatio(orderTicket, oppositeTicket);
      case -1 -> 0;
      default -> throw new InvalidParameterException(
          "compareTo invalid value : " + Long.compare(orderTicket.getRatio(),
              oppositeTicket.getRatio()));
    };
  }

  private long getRatio(@NotNull CoreTicket orderTicket, @NotNull CoreTicket oppositeTicket) {
    long ratioValue = 0;
    // if epochUTC are equals then we get lower ticket ID
    if (orderTicket.getEpochUTC() == oppositeTicket.getEpochUTC()) {
      if (orderTicket.getId() < oppositeTicket.getId()) {
        ratioValue = orderTicket.getRatio();
      } else {
        ratioValue = oppositeTicket.getRatio();
      }
    } else {
      if (orderTicket.getEpochUTC() < oppositeTicket.getEpochUTC()) {
        ratioValue = orderTicket.getRatio();
      } else {
        ratioValue = oppositeTicket.getRatio();
      }
    }
    return ratioValue;
  }

  private long getExchangeValue(final @NotNull CoreTicket orderTicket,
      final @NotNull long exchangeRatio) {
    if (Direction.BUY.equals(orderTicket.getDirection())) {
      return orderTicket.getValue() / exchangeRatio;
    } else {
      return orderTicket.getValue();
    }
  }

  private long getEpochUTC() {
    Calendar calendar = Calendar.getInstance();
    calendar.setTimeZone(TimeZone.getTimeZone("UTC"));
    return calendar.getTimeInMillis();
  }

  private long getOppositeExchange(CoreTicket orderTicket, CoreTicket oppositeTicket,
      long orderExchangeRatio) {
    long oppositeAmount = getExchangeValue(oppositeTicket, orderExchangeRatio);
    long orderAmount = getExchangeValue(orderTicket, orderExchangeRatio);

    return Math.min(orderAmount, oppositeAmount);
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

    long oppositeExchange = getOppositeExchange(orderTicket, oppositeTicket, orderExchangeRatio);
    long orderExchangeAmount = oppositeExchange * orderExchangeRatio;
    orderExchangeAmount = orderExchangeAmount / CoreTicketProperties.ROUNDING;

    ExchangeResult result = new ExchangeResult(orderTicket, oppositeTicket);

    result.setOrderExchange(
        prepareExchangeTicket(orderTicket, oppositeTicket, orderExchangeRatio, oppositeExchange,
            epochUTC));
    result.setOppositeExchange(
        prepareExchangeTicket(oppositeTicket, orderTicket, orderExchangeRatio, orderExchangeAmount,
            epochUTC));

    result.setOrderTicketAfterExchange(
        prepareOrderTicketAfterExchange(orderTicket, oppositeTicket, orderExchangeAmount,
            epochUTC));
    if (orderTicket.getValue() - oppositeTicket.getValue() > 0) {
      orderTicket = orderTicket.newValue(orderTicket.getValue() - oppositeTicket.getValue(),
          epochUTC);
      if (orderTicket.getValue() > 0) {
        bookOrder.addOrderTicket(orderTicket, true);
      }
    }
    result.setOppositeTicketAfterExchange(
        prepareOrderTicketAfterExchange(oppositeTicket, orderTicket, oppositeExchange, epochUTC));
    if (oppositeTicket.getValue() - orderTicket.getValue() > 0) {
      oppositeTicket = oppositeTicket.newValue(oppositeTicket.getValue() - orderTicket.getValue(),
          epochUTC);
      if (orderTicket.getValue() > 0) {
        bookOrder.addOrderTicket(oppositeTicket, true);
      }
    }
    bookOrder.checkIfFinishOrder(Direction.BUY, orderTicket, result.getOrderTicketAfterExchange());
    bookOrder.checkIfFinishOrder(Direction.SELL, oppositeTicket,
        result.getOppositeTicketAfterExchange());

    result.fastValidate();
    if (log.isDebugEnabled()) {
      log.debug(result.toString());
      log.debug("Finish do exchange ");
    }
    return result;
  }

  private CoreTicket prepareExchangeTicket(CoreTicket orderTicket, CoreTicket oppositeTicket,
      long orderExchangeRatio,
      long exchangeAmount, long epochUTC) {
    return ExchangeTicketBuilder.createBuilder().withId(orderTicket.getId())
        .withIdOrderReverse(oppositeTicket.getId()).withDirection(oppositeTicket.getDirection())
        .withPair(orderTicket.getPair()).withRatio(orderExchangeRatio)
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
      long orderExchange, long epochUTC) {
    return OrderUtils.split(orderTicket, orderExchange, epochUTC, oppositeTicket.getId());
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
