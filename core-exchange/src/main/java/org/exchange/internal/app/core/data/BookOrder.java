package org.exchange.internal.app.core.data;


import static org.exchange.app.common.api.model.Direction.BUY;

import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import lombok.Getter;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.exchange.internal.app.core.builders.CoreTicket;
import org.exchange.internal.app.core.builders.CoreTicketProperties;

public final class BookOrder {

  private final Pair pair;

  @Getter
  private final List<SamePriceOrderList> priceOrdersList;
  private final Direction direction;

  public BookOrder(final Pair pair, final Direction direction) {

    this.pair = pair;
    this.priceOrdersList = new ArrayList<>();
    this.direction = direction;
  }

  public boolean addTicket(final @NotNull CoreTicket ticket, final boolean addAsFirstElement) {

    if (ticket.getAmount() < CoreTicketProperties.ROUNDING) {
      return false;
    }

    priceOrdersList.stream()
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
              priceOrdersList.add(newList);
              if (BUY.equals(direction)) {
                priceOrdersList.sort(Comparator.comparing(SamePriceOrderList::getRatio).reversed());
              } else {
                priceOrdersList.sort(Comparator.comparing(SamePriceOrderList::getRatio));
              }
            }
        );

    return true;
  }

  @Override
  public String toString() {
    StringBuilder builder = new StringBuilder();
    builder.append(String.format("From : '%s' exchangeAB: '%s'", pair, direction));
    builder.append("\n\r");
    for (final SamePriceOrderList elem : priceOrdersList) {
      builder.append(String.format("Exchange ratio: %s count: %s\n\r", elem.getRatio(),
          elem.getList().size()));
      builder.append(elem);
    }
    return builder.toString();
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
    priceOrdersList.stream()
        .filter(element -> element.getRatio() == ticket.getRatio()).findFirst().ifPresent(
            (priceOrder) -> removed.set(priceOrder.removeTicket(ticket))
        );
    return removed.get();
  }

  public CoreTicket getFirstElement() {
    if (!priceOrdersList.isEmpty()) {
      SamePriceOrderList firstSamePriceOrderList = priceOrdersList.getFirst();
      List<CoreTicket> orderTicketList = firstSamePriceOrderList.getList();
      if (!orderTicketList.isEmpty()) {
        return orderTicketList.getFirst();
      }
    }
    return null;
  }

  public boolean removeFirstElement(final @NotNull CoreTicket ticket) {

    if (!priceOrdersList.isEmpty()) {
      boolean removeResult = false;
      SamePriceOrderList firstSamePriceOrderList = priceOrdersList.getFirst();
      List<CoreTicket> orderTicketList = firstSamePriceOrderList.getList();
      if (!orderTicketList.isEmpty()) {
        removeResult = orderTicketList.remove(ticket);
      }
      if (orderTicketList.isEmpty()) {
        priceOrdersList.remove(firstSamePriceOrderList);
      }
      return removeResult;

    }

    return false;
  }

  public int getPriceOrdersListSize() {
    return priceOrdersList.size();
  }

  public int getTotalTicketOrders() {
    return priceOrdersList.stream().mapToInt(SamePriceOrderList::size).sum();
  }

  public CoreTicket removeOrder(final Long id) {
    for (final SamePriceOrderList samePriceOrderList : priceOrdersList) {
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
      priceOrdersList.remove(samePriceOrderList);
    }
    return retValue;
  }
}
