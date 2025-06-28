package org.exchange.internal.app.core.data;

import java.util.EnumMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.SortedMap;
import java.util.TreeMap;
import org.exchange.app.common.api.model.Direction;
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

  public String getOrderBookJson(boolean fullOrderBook) {
    this.ratioAmountBuyMap.clear();
    this.ratioAmountSellMap.clear();
    SortedMap<Long, Long> currentBuyMap = orderBookEnumMap.get(Direction.BUY).ratioAmountMap();
    SortedMap<Long, Long> currentSellMap = orderBookEnumMap.get(Direction.SELL).ratioAmountMap();
    String buy;
    String sell;
    if (fullOrderBook) {
      buy = orderBookEnumMap.get(Direction.BUY).toJson(true);
      sell = orderBookEnumMap.get(Direction.SELL).toJson(false);
    } else {
      buy = makeDifference(this.ratioAmountBuyMap, currentBuyMap);
      sell = makeDifference(this.ratioAmountSellMap, currentSellMap);
    }
    this.ratioAmountBuyMap.putAll(currentBuyMap);
    this.ratioAmountSellMap.putAll(currentSellMap);
    return String.format("{\"pair\":\"%s\",\"full\":%b,\"sell\":[%s],\"buy\":[%s]}",
        pair.toString(), fullOrderBook, sell, buy);
  }

  public String makeDifference(SortedMap<Long, Long> previousState,
      SortedMap<Long, Long> currentState) {
    if (previousState == null || currentState == null) {
      return "";
    }
    Set<Long> allKeys = new HashSet<>();
    allKeys.addAll(previousState.keySet());
    allKeys.addAll(currentState.keySet());
    StringBuilder stringBuilder = new StringBuilder();
    allKeys.forEach(key -> {
      long diff = currentState.getOrDefault(key, 0L) - previousState.getOrDefault(key, 0L);
      if (diff != 0) {
        stringBuilder.append("{");
        stringBuilder.append("\"ratio\":");
        stringBuilder.append(key);
        stringBuilder.append(",\"amount\":");
        stringBuilder.append(diff);
        stringBuilder.append("},");
      }
    });
    if (stringBuilder.length() > 1) {
      stringBuilder.setLength(stringBuilder.length() - 1);
    }
    return stringBuilder.toString();
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
