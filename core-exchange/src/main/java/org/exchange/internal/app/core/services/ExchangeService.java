package org.exchange.internal.app.core.services;

import static org.exchange.app.backend.common.builders.CoreTicketProperties.MAX_EXCHANGE_ERROR;
import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Direction.SELL;

import jakarta.validation.constraints.NotNull;
import java.security.InvalidParameterException;
import java.util.Optional;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.builders.CoreTicketProperties;
import org.exchange.app.backend.common.builders.ExchangeResult;
import org.exchange.app.backend.common.builders.ExchangeTicketBuilder;
import org.exchange.app.backend.common.exceptions.ExchangeException;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.OrderBookData;
import org.exchange.app.common.api.model.Pair;
import org.exchange.internal.app.core.data.OrderBookMap;
import org.exchange.internal.app.core.strategies.ratio.RatioStrategy;

@Log4j2
public final class ExchangeService {

  private final OrderBookMap orderBookMap;
  private final RatioStrategy ratioStrategy;

  public ExchangeService(final Pair currencyChange, final RatioStrategy ratioStrategy) {
    this.ratioStrategy = ratioStrategy;
    orderBookMap = new OrderBookMap(currencyChange);
  }

  public void addCoreTicket(final @NotNull CoreTicket ticket) {
    orderBookMap.addTicket(ticket, false);
  }

  public int getTotalTicketOrders(Direction direction) {
    return orderBookMap.getTotalTicketOrders(direction);
  }

  public long getExchangeValue(final @NotNull CoreTicket coreTicket,
      final @NotNull long exchangeRatio) {
    if (BUY.equals(coreTicket.getDirection())) {
      double result = coreTicket.getAmount();
      result /= exchangeRatio;
      result *= CoreTicketProperties.ROUNDING;
      long longResult = (long) result;
      longResult = longResult - (longResult % MAX_EXCHANGE_ERROR);
      return longResult;
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


  public Optional<ExchangeResult> doExchange() {
    Optional<CoreTicket> buyTicket = orderBookMap.getFirstElement(BUY);
    Optional<CoreTicket> sellTicket = orderBookMap.getFirstElement(SELL);

    if (buyTicket.isEmpty() || sellTicket.isEmpty()) {
      return Optional.empty();
    }

    long exchangeRatio = getExchangeRatio(buyTicket.get(), sellTicket.get());
    if (exchangeRatio == 0) {
      return Optional.empty();
    }

    removeFirstElement(buyTicket.get());
    removeFirstElement(sellTicket.get());
    return Optional.of(doExchange(buyTicket.get(), sellTicket.get(), exchangeRatio));
  }

  ExchangeResult doExchange(CoreTicket buyTicket, CoreTicket sellTicket,
      long exchangeRatio) {

    long sellAmount = getExchangeAmount(buyTicket, sellTicket, exchangeRatio);
    long buyAmount = sellAmount * exchangeRatio;
    buyAmount /= CoreTicketProperties.ROUNDING;
    buyAmount = buyAmount - buyAmount % MAX_EXCHANGE_ERROR;

    ExchangeResult result = prepareExchangeResult(buyTicket, buyAmount, sellTicket,
        sellAmount, exchangeRatio);

    backTicketToBookOrderIfNotFullExchange(sellTicket, sellAmount);
    backTicketToBookOrderIfNotFullExchange(buyTicket, buyAmount);

    return result;
  }

  private ExchangeResult prepareExchangeResult(CoreTicket buyTicket, long buyAmount,
      CoreTicket sellTicket, long sellAmount, long exchangeRatio) {
    ExchangeResult result = new ExchangeResult(buyTicket, sellTicket);

    result.setBuyExchange(prepareExchangeTicket(buyTicket, sellTicket, exchangeRatio,
        sellAmount));
    result.setSellExchange(prepareExchangeTicket(sellTicket, buyTicket, exchangeRatio, buyAmount));

    result.setBuyTicketAfterExchange(
        calculateAmountAfterExchange(buyTicket, sellTicket, buyAmount));

    result.setSellTicketAfterExchange(
        calculateAmountAfterExchange(sellTicket, buyTicket, sellAmount));
    result.fastValidate();
    return result;
  }

  private void backTicketToBookOrderIfNotFullExchange(CoreTicket ticket, long amount) {
    if (ticket.getAmount() - amount > CoreTicketProperties.ROUNDING) {
      ticket = ticket.newAmount(ticket.getAmount() - amount);
      orderBookMap.addTicket(ticket, true);
    }
  }

  public CoreTicket prepareExchangeTicket(CoreTicket buyTicket, CoreTicket sellTicket,
      long orderExchangeRatio, long exchangeAmount) {
    return ExchangeTicketBuilder
        .createBuilder()
        .withId(buyTicket.getId())
        .withReverseTicketId(sellTicket.getId())
        .withDirection(sellTicket.getDirection())
        .withPair(buyTicket.getPair())
        .withRatio(orderExchangeRatio)
        .withUserId(buyTicket.getUserId())
        .withAmount(exchangeAmount)
        .build();
  }

  private void removeFirstElement(final CoreTicket coreTicket) {
    if (!orderBookMap.removeFirstElement(coreTicket)) {
      throw new ExchangeException("Unable to remove ticket " + coreTicket.toString());
    }
  }

  private CoreTicket calculateAmountAfterExchange(final CoreTicket coreTicket,
      final CoreTicket sellTicket, long orderExchangeValue) {
    return coreTicket.newAmount(coreTicket.getAmount() - orderExchangeValue, sellTicket.getId());
  }


  public Optional<CoreTicket> removeOrder(final Long id, final Direction direction) {
    return orderBookMap.removeOrder(direction, id);
  }

  public void printStatus() {
    orderBookMap.printStatus();
  }

  public boolean removeCancelled(final CoreTicket ticket) {
    return orderBookMap.removeCancelled(ticket);
  }

  public Optional<CoreTicket> getFirstBookTicket(Direction direction) {
    return orderBookMap.getFirstElement(direction);
  }

  public OrderBookData getOrderBookData(boolean fullOrderBook) {
    return orderBookMap.getOrderBookData(fullOrderBook);
  }
}
