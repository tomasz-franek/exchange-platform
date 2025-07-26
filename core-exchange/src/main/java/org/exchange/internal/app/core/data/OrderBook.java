package org.exchange.internal.app.core.data;


import static org.exchange.app.common.api.model.Direction.BUY;

import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.SortedMap;
import java.util.TreeMap;
import java.util.concurrent.atomic.AtomicBoolean;
import lombok.Getter;
import org.exchange.app.backend.common.exceptions.ExchangeException;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.OrderBookRow;
import org.exchange.app.common.api.model.Pair;
import org.exchange.internal.app.core.builders.CoreTicket;
import org.exchange.internal.app.core.builders.CoreTicketProperties;

public final class OrderBook {

  private final Pair pair;

  @Getter
  private final List<SamePriceOrderList> samePriceOrderLists;
  private final Direction direction;

  public OrderBook(final Pair pair, final Direction direction) {

    this.pair = pair;
    this.samePriceOrderLists = new ArrayList<>();
    this.direction = direction;
  }

  public void addTicket(final @NotNull CoreTicket ticket, final boolean addAsFirstElement) {

    if (ticket.getAmount() < CoreTicketProperties.MAX_EXCHANGE_ERROR) {
      throw new ExchangeException(
          String.format("Amount %d cant be lower %d", ticket.getAmount(),
              CoreTicketProperties.MAX_EXCHANGE_ERROR));
    }

    samePriceOrderLists.stream()
        .filter(element -> element.getRatio() == ticket.getRatio()).findFirst().ifPresentOrElse(
            (priceOrder) -> {
              if (addAsFirstElement) {
                priceOrder.getList().addFirst(ticket);
              } else {
                priceOrder.add(ticket);
              }
            },
            () -> {
              SamePriceOrderList newList = new SamePriceOrderList(pair, direction, ticket.getRatio());
              newList.add(ticket);
              samePriceOrderLists.add(newList);
              if (BUY.equals(direction)) {
                samePriceOrderLists.sort(
                    Comparator.comparing(SamePriceOrderList::getRatio).reversed());
              } else {
                samePriceOrderLists.sort(Comparator.comparing(SamePriceOrderList::getRatio));
              }
            }
        );
  }

  public SortedMap<Long, Long> ratioAmountMap() {
    SortedMap<Long, Long> map = new TreeMap<>();
    samePriceOrderLists.forEach(samePriceOrderList -> map.put(samePriceOrderList.getRatio(),
        samePriceOrderList.getSumAmount().get()));
    return map;
  }

  @Override
  public String toString() {
    StringBuilder builder = new StringBuilder();
    builder.append(String.format("From : '%s' exchangeAB: '%s'", pair, direction));
    builder.append("\n\r");
    for (final SamePriceOrderList elem : samePriceOrderLists) {
      builder.append(String.format("Exchange ratio: %s count: %s\n\r", elem.getRatio(),
          elem.getList().size()));
      builder.append(elem);
    }
    return builder.toString();
  }

  public List<OrderBookRow> toOrderBookList(boolean ascending) {
    List<OrderBookRow> list = new ArrayList<>();
    if (ascending) {
      samePriceOrderLists.forEach(e -> list.add(e.getOrderBookRow()));
    } else {
      samePriceOrderLists.reversed().forEach(e -> list.add(e.getOrderBookRow()));
    }
    return list;
  }

  public void backOrderTicketToList(final CoreTicket newTicketValue) {

    CoreTicket originalTicket = getFirstElement();
    if (originalTicket != null) {
      CoreTicket overriddenTicketValue = overrideTicketValue(originalTicket, newTicketValue);
      if (overriddenTicketValue != null) {
        addTicket(overriddenTicketValue, true);
      }
    } else {
      addTicket(newTicketValue, true);
    }
  }

  private CoreTicket overrideTicketValue(final @NotNull CoreTicket originalTicket,
      final @NotNull CoreTicket newTicket) {
    if (originalTicket.getId() == newTicket.getId()
        && originalTicket.getRatio() == newTicket.getRatio()
        && this.pair.equals(newTicket.getPair())
        && this.direction.equals(newTicket.getDirection())) {
      return new CoreTicket(originalTicket.getId(), newTicket.getAmount(),
          originalTicket.getRatio(), originalTicket.getEpochUTC(), originalTicket.getUserId(), pair,
          direction);
    }
    return null;
  }

  public boolean removeCancelled(final @NotNull CoreTicket ticket) {
    AtomicBoolean removed = new AtomicBoolean(false);
    samePriceOrderLists.stream()
        .filter(element -> element.getRatio() == ticket.getRatio()).findFirst().ifPresent(
            (priceOrder) -> removed.set(priceOrder.removeTicket(ticket))
        );
    return removed.get();
  }

  public CoreTicket getFirstElement() {
    if (!samePriceOrderLists.isEmpty()) {
      SamePriceOrderList firstSamePriceOrderList = samePriceOrderLists.getFirst();
      List<CoreTicket> orderTicketList = firstSamePriceOrderList.getList();
      if (!orderTicketList.isEmpty()) {
        return orderTicketList.getFirst();
      }
    }
    return null;
  }

  public boolean removeFirstElement(final @NotNull CoreTicket ticket) {

    if (!samePriceOrderLists.isEmpty()) {
      boolean removeResult = false;
      SamePriceOrderList firstSamePriceOrderList = samePriceOrderLists.getFirst();
      List<CoreTicket> orderTicketList = firstSamePriceOrderList.getList();
      if (!orderTicketList.isEmpty()) {
        removeResult = orderTicketList.remove(ticket);
      }
      if (orderTicketList.isEmpty()) {
        samePriceOrderLists.remove(firstSamePriceOrderList);
      }
      return removeResult;
    }
    return false;
  }

  public int getPriceOrdersListSize() {
    return samePriceOrderLists.size();
  }

  public int getTotalTicketOrders() {
    return samePriceOrderLists.stream().mapToInt(SamePriceOrderList::size).sum();
  }

  public CoreTicket removeOrder(final Long id) {
    for (final SamePriceOrderList samePriceOrderList : samePriceOrderLists) {
      for (final CoreTicket ticket : samePriceOrderList.getList()) {
        if (ticket.getId() == id) {
          if (removeTicket(samePriceOrderList, ticket)) {
            return ticket;
          }
        }
      }
    }
    return null;
  }

  private boolean removeTicket(SamePriceOrderList samePriceOrderList, CoreTicket ticket) {
    boolean retValue;
    retValue = samePriceOrderList.removeTicket(ticket);
    if (samePriceOrderList.getList().isEmpty()) {
      samePriceOrderLists.remove(samePriceOrderList);
    }
    return retValue;
  }
}
