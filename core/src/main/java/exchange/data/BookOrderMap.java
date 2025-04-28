package exchange.data;

import exchange.app.api.model.Direction;
import exchange.app.api.model.Pair;
import exchange.builders.CoreTicket;
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

    public boolean addOrderTicket(CoreTicket ticket, boolean addFirst) throws ExchangeException {

        return getBook(ticket).addOrderTicket(ticket, addFirst);
    }

    public int getPriceOrdersListSize(Direction direction) {

        return getBook(direction).getPriceOrdersListSize();
    }

    public CoreTicket getFirstElement(Direction direction) {

        return getBook(direction).getFirstElement();
    }

    public boolean checkIfFinishOrder(Direction direction, final CoreTicket orderTicket,
                                      final CoreTicket exchangeTicket) throws ExchangeException {

        return getBook(direction).checkIfFinishOrder(orderTicket, exchangeTicket);
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

    public boolean backOrderTicketToList(CoreTicket ticket) throws ExchangeException {

        return getBook(ticket).backOrderTicketToList(ticket);
    }

    public boolean removeCancelled(CoreTicket ticket) throws ExchangeException {

        return getBook(ticket).removeCancelled(ticket);
    }

    private BookOrder getBook(CoreTicket ticket) {

        return getBook(ticket.getDirection());
    }

    private BookOrder getBook(Direction direction) {

        return bookOrder.get(direction);
    }
}
