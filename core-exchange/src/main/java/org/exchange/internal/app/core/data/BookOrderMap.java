package org.exchange.internal.app.core.data;

import java.util.EnumMap;
import java.util.List;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.exchange.internal.app.core.builders.CoreTicket;
import org.exchange.internal.app.core.builders.CoreTicketProperties;

public class BookOrderMap {

  private final EnumMap<Direction, BookOrder> bookOrder;

  public BookOrderMap(final Pair pair) {

    bookOrder = new EnumMap<>(Direction.class);
    for (Direction direction : Direction.values()) {
      bookOrder.put(direction, new BookOrder(pair, direction));
    }
  }

  public String getOrderBookJson() {
    String buy = bookOrder.get(Direction.BUY).toJson(true);
    String sell = bookOrder.get(Direction.SELL).toJson(false);
    return String.format("{\"sell\":[%s],\"buy\":[%s]}", sell, buy);
  }

  public boolean addTicket(CoreTicket ticket, boolean addFirst) {

    return getBook(ticket).addTicket(ticket, addFirst);
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
