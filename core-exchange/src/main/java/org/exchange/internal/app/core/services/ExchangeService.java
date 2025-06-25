package org.exchange.internal.app.core.services;

import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Direction.SELL;

import jakarta.validation.constraints.NotNull;
import java.security.InvalidParameterException;
import lombok.extern.log4j.Log4j2;
import org.apache.commons.lang3.ObjectUtils;
import org.exchange.app.backend.common.exceptions.ExchangeException;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.exchange.internal.app.core.builders.CoreTicket;
import org.exchange.internal.app.core.builders.CoreTicketProperties;
import org.exchange.internal.app.core.builders.ExchangeTicketBuilder;
import org.exchange.internal.app.core.data.BookOrderMap;
import org.exchange.internal.app.core.data.ExchangeResult;
import org.exchange.internal.app.core.data.SamePriceOrderList;
import org.exchange.internal.app.core.strategies.ratio.RatioStrategy;

@Log4j2
public final class ExchangeService {

  private final BookOrderMap bookOrder;
  private final RatioStrategy ratioStrategy;

  public ExchangeService(final Pair currencyChange,
      final RatioStrategy ratioStrategy) {
    this.ratioStrategy = ratioStrategy;
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

  public long getExchangeValue(final @NotNull CoreTicket coreTicket,
      final @NotNull long exchangeRatio) {
    if (BUY.equals(coreTicket.getDirection())) {
      double result = coreTicket.getAmount();
      result /= exchangeRatio;
      result *= CoreTicketProperties.ROUNDING;
      return (long) result;
    } else {
      return coreTicket.getAmount();
    }
  }

  public long getExchangeAmount(CoreTicket buyTicket, CoreTicket sellTicket,
      long orderExchangeRatio) {
    assert BUY.equals(buyTicket.getDirection());
    assert SELL.equals(sellTicket.getDirection());
    long sellAmount = getExchangeValue(sellTicket, orderExchangeRatio);
    long buyAmount = getExchangeValue(buyTicket, orderExchangeRatio);

    return Math.min(sellAmount, buyAmount);
  }

  public long getExchangeRatio(final @NotNull CoreTicket buyTicket,
      final @NotNull CoreTicket sellTicket) {

    return switch (Long.compare(buyTicket.getRatio(), sellTicket.getRatio())) {
      case 0 -> buyTicket.getRatio();
      case 1 -> ratioStrategy.getRatio(buyTicket, sellTicket);
      case -1 -> 0;
      default -> throw new InvalidParameterException(
          "compareTo invalid value : " + Long.compare(buyTicket.getRatio(),
              sellTicket.getRatio()));
    };
  }


  public ExchangeResult doExchange() throws ExchangeException {
    CoreTicket buyTicket = bookOrder.getFirstElement(BUY);
    CoreTicket sellTicket = bookOrder.getFirstElement(SELL);

    if (ObjectUtils.anyNull(buyTicket, sellTicket)) {
      return null;
    }

    long exchangeRatio = getExchangeRatio(buyTicket, sellTicket);
    if (exchangeRatio == 0) {
      return null;
    }

    removeFirstElement(buyTicket);
    removeFirstElement(sellTicket);
    return doExchange(buyTicket, sellTicket, exchangeRatio);
  }

  private ExchangeResult doExchange(CoreTicket buyTicket, CoreTicket sellTicket,
      long exchangeRatio)
      throws ExchangeException {

    long epochUTC = ExchangeDateUtils.currentEpochUtc();

    long sellAmount = getExchangeAmount(buyTicket, sellTicket, exchangeRatio);
    long buyAmount = sellAmount * exchangeRatio;
    buyAmount /= CoreTicketProperties.ROUNDING;

    ExchangeResult result = prepareExchangeResult(buyTicket, buyAmount, sellTicket, sellAmount,
        exchangeRatio, epochUTC);

    backTicketToBookOrderIfNotFullExchange(sellTicket, sellAmount, epochUTC);
    backTicketToBookOrderIfNotFullExchange(buyTicket, buyAmount, epochUTC);

    if (log.isDebugEnabled()) {
      log.debug(result.toString());
      log.debug("Finish do exchange ");
    }
    return result;
  }

  private ExchangeResult prepareExchangeResult(CoreTicket buyTicket, long buyAmount,
      CoreTicket sellTicket, long sellAmount,
      long exchangeRatio, long epochUTC) throws ExchangeException {
    ExchangeResult result = new ExchangeResult(buyTicket, sellTicket);

    result.setBuyExchange(
        prepareExchangeTicket(buyTicket, sellTicket, exchangeRatio,
            sellAmount, epochUTC));
    result.setSellExchange(
        prepareExchangeTicket(sellTicket, buyTicket, exchangeRatio, buyAmount,
            epochUTC));

    result.setBuyTicketAfterExchange(
        calculateAmountAfterExchange(buyTicket, sellTicket, buyAmount,
            epochUTC));

    result.setSellTicketAfterExchange(
        calculateAmountAfterExchange(sellTicket, buyTicket, sellAmount,
            epochUTC));
    result.fastValidate();
    return result;
  }

  private void backTicketToBookOrderIfNotFullExchange(CoreTicket ticket, long amount,
      long epochUTC) {
    if (ticket.getAmount() - amount > CoreTicketProperties.ROUNDING) {
      ticket = ticket.newAmount(ticket.getAmount() - amount,
          epochUTC);
      bookOrder.addTicket(ticket, true);
    }
  }

  public CoreTicket prepareExchangeTicket(
      CoreTicket buyTicket,
      CoreTicket sellTicket,
      long orderExchangeRatio,
      long exchangeAmount,
      long epochUTC) {
    return ExchangeTicketBuilder.createBuilder().withId(buyTicket.getId())
        .withReverseTicketId(sellTicket.getId()).withDirection(sellTicket.getDirection())
        .withPair(buyTicket.getPair())
        .withRatio(orderExchangeRatio)
        .withUserId(buyTicket.getUserId())
        .withAmount(exchangeAmount)
        .withEpochUTC(epochUTC).build();
  }

  private void removeFirstElement(final CoreTicket buyTicket) throws ExchangeException {

    if (!bookOrder.removeFirstElement(buyTicket)) {
      throw new ExchangeException("Unable to remove ticket " + buyTicket.toString());
    }
  }

  private CoreTicket calculateAmountAfterExchange(final CoreTicket buyTicket,
      final CoreTicket sellTicket, long orderExchangeValue, long epochUTC) {
    return buyTicket.newAmount(buyTicket.getAmount() - orderExchangeValue, epochUTC,
        sellTicket.getId());
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

  public String getOrderBook() {
    return bookOrder.getOrderBookJson();
  }
}
