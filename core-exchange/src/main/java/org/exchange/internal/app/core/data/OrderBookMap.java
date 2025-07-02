package org.exchange.internal.app.core.data;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.SortedMap;
import java.util.TreeMap;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.OrderBookData;
import org.exchange.app.common.api.model.OrderBookRow;
import org.exchange.app.common.api.model.Pair;
import org.exchange.internal.app.core.builders.CoreTicket;
import org.exchange.internal.app.core.builders.CoreTicketProperties;

public class OrderBookMap {

  private final EnumMap<Direction, OrderBook> orderBookEnumMap;
  private final SortedMap<Long, Long> ratioAmountBuyMap;
  private final SortedMap<Long, Long> ratioAmountSellMap;
  private final Pair pair;

  public OrderBookMap(final Pair pair) {
    this.ratioAmountBuyMap = new TreeMap<>();
    this.ratioAmountSellMap = new TreeMap<>();
    this.pair = pair;
    this.orderBookEnumMap = new EnumMap<>(Direction.class);
    for (Direction direction : Direction.values()) {
      orderBookEnumMap.put(direction, new OrderBook(pair, direction));
    }
  }

  public OrderBookData getOrderBookData(boolean fullOrderBook) {
    this.ratioAmountBuyMap.clear();
    this.ratioAmountSellMap.clear();
    SortedMap<Long, Long> currentBuyMap = orderBookEnumMap.get(Direction.BUY).ratioAmountMap();
    SortedMap<Long, Long> currentSellMap = orderBookEnumMap.get(Direction.SELL).ratioAmountMap();
    List<OrderBookRow> buy;
    List<OrderBookRow> sell;
    if (fullOrderBook) {
      buy = orderBookEnumMap.get(Direction.BUY).toOrderBookList(true);
      sell = orderBookEnumMap.get(Direction.SELL).toOrderBookList(false);
    } else {
      buy = makeDifference(this.ratioAmountBuyMap, currentBuyMap);
      sell = makeDifference(this.ratioAmountSellMap, currentSellMap);
    }
    this.ratioAmountBuyMap.putAll(currentBuyMap);
    this.ratioAmountSellMap.putAll(currentSellMap);
    return new OrderBookData(pair, fullOrderBook, buy, sell);
  }

  public List<OrderBookRow> makeDifference(SortedMap<Long, Long> previousState,
      SortedMap<Long, Long> currentState) {
    if (previousState == null || currentState == null) {
      return List.of();
    }
    Set<Long> allKeys = new HashSet<>();
    allKeys.addAll(previousState.keySet());
    allKeys.addAll(currentState.keySet());
    List<OrderBookRow> list = new ArrayList<>();
    allKeys.forEach(key -> {
      long diff = currentState.getOrDefault(key, 0L) - previousState.getOrDefault(key, 0L);
      if (diff != 0) {
        list.add(new OrderBookRow(key, diff));
      }
    });
    return list;
  }

  public void addTicket(CoreTicket ticket, boolean addFirst) {
    assert ticket.getPair().equals(this.pair);
    getOrderBook(ticket).addTicket(ticket, addFirst);
  }

  public int getPriceOrdersListSize(Direction direction) {

    return getOrderBook(direction).getPriceOrdersListSize();
  }

  public int getTotalTicketOrders(Direction direction) {
    return getOrderBook(direction).getTotalTicketOrders();
  }

  public CoreTicket getFirstElement(Direction direction) {

    return getOrderBook(direction).getFirstElement();
  }

  public void addTicketToBookWhenNotFinished(final CoreTicket orderTicket,
      final CoreTicket exchangeTicket) {

    if (exchangeTicket.getAmount() >= CoreTicketProperties.ROUNDING * orderTicket.getRatio()) {
      getOrderBook(orderTicket.getDirection()).addTicket(exchangeTicket, true);
    }
  }

  public boolean removeFirstElement(CoreTicket ticket) {

    return getOrderBook(ticket).removeFirstElement(ticket);
  }

  public List<SamePriceOrderList> getPriceOrdersList(Direction direction) {

    return getOrderBook(direction).getSamePriceOrderLists();
  }

  public CoreTicket removeOrder(Direction direction, Long id) {

    return getOrderBook(direction).removeOrder(id);
  }

  public void backOrderTicketToList(CoreTicket ticket) {

    getOrderBook(ticket).backOrderTicketToList(ticket);
  }

  public boolean removeCancelled(CoreTicket ticket) {

    return getOrderBook(ticket).removeCancelled(ticket);
  }

  private OrderBook getOrderBook(CoreTicket ticket) {

    return getOrderBook(ticket.getDirection());
  }

  private OrderBook getOrderBook(Direction direction) {

    return orderBookEnumMap.get(direction);
  }
}
