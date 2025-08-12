package org.exchange.internal.app.core.data;

import java.util.ArrayList;
import java.util.EnumMap;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.SortedMap;
import java.util.TreeMap;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.OrderBookData;
import org.exchange.app.common.api.model.OrderBookRow;
import org.exchange.app.common.api.model.Pair;

@Log4j2
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

    SortedMap<Long, Long> currentBuyMap = orderBookEnumMap.get(Direction.BUY).ratioAmountMap();
    SortedMap<Long, Long> currentSellMap = orderBookEnumMap.get(Direction.SELL).ratioAmountMap();
    List<OrderBookRow> buy;
    List<OrderBookRow> sell;
    if (fullOrderBook) {
      buy = orderBookEnumMap.get(Direction.BUY).toOrderBookList(true);
      sell = orderBookEnumMap.get(Direction.SELL).toOrderBookList(false);
    } else {
      buy = differenceOfOrderBooks(this.ratioAmountBuyMap, currentBuyMap);
      sell = differenceOfOrderBooks(this.ratioAmountSellMap, currentSellMap);
      this.ratioAmountBuyMap.clear();
      this.ratioAmountSellMap.clear();
      this.ratioAmountBuyMap.putAll(currentBuyMap);
      this.ratioAmountSellMap.putAll(currentSellMap);
    }

    return new OrderBookData(pair, fullOrderBook, buy, sell);
  }

  public List<OrderBookRow> differenceOfOrderBooks(SortedMap<Long, Long> previousState,
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

  public int getTotalTicketOrders(Direction direction) {
    return getOrderBook(direction).getTotalTicketOrders();
  }

  public Optional<CoreTicket> getFirstElement(Direction direction) {

    return getOrderBook(direction).getFirstElement();
  }

  public boolean removeFirstElement(CoreTicket ticket) {

    return getOrderBook(ticket).removeFirstElement(ticket);
  }

  public Optional<CoreTicket> removeOrder(Direction direction, Long id) {

    return getOrderBook(direction).removeOrder(id);
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

  public void printStatus() {
    if (log.isDebugEnabled()) {
      for (Direction direction : Direction.values()) {
        log.debug("order {}", direction.name());
        getOrderBook(direction).printOrderBookList();
      }
    }
  }
}
