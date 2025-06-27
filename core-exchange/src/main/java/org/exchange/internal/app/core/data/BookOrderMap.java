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

public class BookOrderMap {

  private final EnumMap<Direction, BookOrder> bookOrder;
  private final SortedMap<Long, Long> ratioAmountBuyMap;
  private final SortedMap<Long, Long> ratioAmountSellMap;

  public BookOrderMap(final Pair pair) {
    ratioAmountBuyMap = new TreeMap<>();
    ratioAmountSellMap = new TreeMap<>();
    bookOrder = new EnumMap<>(Direction.class);
    for (Direction direction : Direction.values()) {
      bookOrder.put(direction, new BookOrder(pair, direction));
    }
  }

  public String getOrderBookJson(boolean fullOrderBook) {
    this.ratioAmountBuyMap.clear();
    this.ratioAmountSellMap.clear();
    SortedMap<Long, Long> currentBuyMap = bookOrder.get(Direction.BUY).ratioAmountMap();
    SortedMap<Long, Long> currentSellMap = bookOrder.get(Direction.SELL).ratioAmountMap();
    String buy;
    String sell;
    if (fullOrderBook) {
      buy = bookOrder.get(Direction.BUY).toJson(true);
      sell = bookOrder.get(Direction.SELL).toJson(false);
    } else {
      buy = makeDifference(this.ratioAmountBuyMap, currentBuyMap);
      sell = makeDifference(this.ratioAmountSellMap, currentSellMap);
    }
    this.ratioAmountBuyMap.putAll(currentBuyMap);
    this.ratioAmountSellMap.putAll(currentSellMap);
    return String.format("{\"sell\":[%s],\"buy\":[%s]}", sell, buy);
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

    getBook(ticket).addTicket(ticket, addFirst);
  }

  public int getPriceOrdersListSize(Direction direction) {

    return getBook(direction).getPriceOrdersListSize();
  }

  public int getTotalTicketOrders(Direction direction) {
    return getBook(direction).getTotalTicketOrders();
  }

  public CoreTicket getFirstElement(Direction direction) {

    return getBook(direction).getFirstElement();
  }

  public void addTicketToBookWhenNotFinished(final CoreTicket orderTicket,
      final CoreTicket exchangeTicket) {

    if (exchangeTicket.getAmount() >= CoreTicketProperties.ROUNDING * orderTicket.getRatio()) {
      getBook(orderTicket.getDirection()).addTicket(exchangeTicket, true);
    }
  }

  public boolean removeFirstElement(CoreTicket ticket) {

    return getBook(ticket).removeFirstElement(ticket);
  }

  public List<SamePriceOrderList> getPriceOrdersList(Direction direction) {

    return getBook(direction).getPriceOrdersList();
  }

  public CoreTicket removeOrder(Direction direction, Long id) {

    return getBook(direction).removeOrder(id);
  }

  public void backOrderTicketToList(CoreTicket ticket) {

    getBook(ticket).backOrderTicketToList(ticket);
  }

  public boolean removeCancelled(CoreTicket ticket) {

    return getBook(ticket).removeCancelled(ticket);
  }

  private BookOrder getBook(CoreTicket ticket) {

    return getBook(ticket.getDirection());
  }

  private BookOrder getBook(Direction direction) {

    return bookOrder.get(direction);
  }
}
