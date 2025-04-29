package exchange.data;


import static exchange.app.api.model.Direction.BUY;

import exchange.app.api.model.Direction;
import exchange.app.api.model.Pair;
import exchange.builders.CoreTicket;
import exchange.exceptions.ExchangeException;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.locks.ReentrantLock;
import lombok.Getter;

public final class BookOrder {

  private final Pair pair;

  @Getter
  private final List<SamePriceOrderList> priceOrdersList;
  private final ReentrantLock lock = new ReentrantLock();
  private final Direction direction;

  public BookOrder(final Pair pair, final Direction direction) {

    this.pair = pair;
    this.priceOrdersList = new ArrayList<>();
    this.direction = direction;
  }

  public boolean addTicket(final @NotNull CoreTicket ticket, final boolean addAsFirstElement)
      throws ExchangeException {

    if (!ticket.getPair().equals(this.pair)) {
      return false;
    }

    lock.lock();
    try {
      Optional<SamePriceOrderList> priceOrder = priceOrdersList.stream()
          .filter(element -> element.getRatio() == ticket.getRatio()).findFirst();
      if (priceOrder.isPresent()) {
        if (addAsFirstElement) {
          priceOrder.get().getList().addFirst(ticket);
        } else {
          priceOrder.get().add(ticket);
        }
      } else {
        SamePriceOrderList newList = new SamePriceOrderList(pair, direction, ticket.getRatio());
        newList.add(ticket);
        priceOrdersList.add(newList);
        if (BUY.equals(direction)) {
          priceOrdersList.sort(Comparator.comparing(SamePriceOrderList::getRatio).reversed());
        } else {
          priceOrdersList.sort(Comparator.comparing(SamePriceOrderList::getRatio));
        }
      }
    } finally {
      lock.unlock();
    }
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

  public boolean backOrderTicketToList(final CoreTicket ticket) throws ExchangeException {

    CoreTicket firstTicket = getFirstElement();
    if ((firstTicket != null) && (firstTicket.getId() == ticket.getId())) {
      CoreTicket newTicket = overrideTicketValue(firstTicket, ticket);
      if (newTicket != null) {
        return addTicket(newTicket, true);
      } else {
        return false;
      }
    } else {
      return addTicket(ticket, true);
    }
  }

  private CoreTicket overrideTicketValue(final @NotNull CoreTicket firstTicket,
      final @NotNull CoreTicket ticket) {
    if (firstTicket.getId() == ticket.getId() && firstTicket.getRatio() == ticket.getRatio()
        && firstTicket.getPair().equals(ticket.getPair()) && direction.equals(
        ticket.getDirection())) {
      return new CoreTicket(firstTicket.getId(), ticket.getValue(), ticket.getRatio(),
          ticket.getEpochUTC(), ticket.getIdUser(),
          ticket.getPair(), ticket.getDirection());
    }
    return null;
  }

  public boolean removeCancelled(final @NotNull CoreTicket ticket) {

    CoreTicket firstTicket = getFirstElement();
    if ((firstTicket != null) && (firstTicket.getId() == ticket.getId())) {
      return removeFirstElement(firstTicket);
    }
    return false;
  }

  public CoreTicket getFirstElement() {

    lock.lock();
    try {
      if (!priceOrdersList.isEmpty()) {
        SamePriceOrderList firstSamePriceOrderList = priceOrdersList.getFirst();
        List<CoreTicket> orderTicketList = firstSamePriceOrderList.getList();
        if (!orderTicketList.isEmpty()) {
          return orderTicketList.getFirst();
        }
      }
    } finally {
      lock.unlock();
    }
    return null;
  }

  public boolean removeFirstElement(final @NotNull CoreTicket ticket) {

    lock.lock();
    try {
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
    } finally {
      lock.unlock();
    }
    return false;
  }

  public int getPriceOrdersListSize() {
    return priceOrdersList.size();
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
