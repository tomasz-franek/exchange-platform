package exchange.data;

import exchange.app.api.model.Direction;
import exchange.app.api.model.Pair;
import exchange.builders.CoreTicket;
import exchange.builders.CoreTicketProperties;
import exchange.exceptions.ExchangeException;
import java.util.EnumMap;
import java.util.List;

public class BookOrderMap {

  private final EnumMap<Direction, BookOrder> bookOrder;

  public BookOrderMap(final Pair currencyChange) {

    bookOrder = new EnumMap<>(Direction.class);
    for (Direction directionEnum : Direction.values()) {
      bookOrder.put(directionEnum, new BookOrder(currencyChange, directionEnum));
    }
  }

  public boolean addTicket(CoreTicket ticket, boolean addFirst) throws ExchangeException {

    return getBook(ticket).addTicket(ticket, addFirst);
  }

  public int getPriceOrdersListSize(Direction direction) {

    return getBook(direction).getPriceOrdersListSize();
  }

  public CoreTicket getFirstElement(Direction direction) {

    return getBook(direction).getFirstElement();
  }

  public void addTicketToBookWhenNotFinished(final CoreTicket orderTicket,
      final CoreTicket exchangeTicket) throws ExchangeException {

    if (exchangeTicket.getValue() >= CoreTicketProperties.ROUNDING * orderTicket.getRatio()) {
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

  public void backOrderTicketToList(CoreTicket ticket) throws ExchangeException {

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
