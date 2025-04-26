package exchange.data;


import exchange.app.api.model.Direction;
import exchange.app.api.model.OrderTicket;
import exchange.app.api.model.Pair;
import exchange.comparators.SamePriceOrderListComparator;
import exchange.exceptions.ExchangeException;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.locks.ReentrantLock;

public final class BookOrder {

    private final Pair currencyChange;
    private static final BigDecimal ONE_CENT = new BigDecimal("0.01");
    private static final SamePriceOrderListComparator COMPARE_BUY = new SamePriceOrderListComparator(Direction.BUY);
    private static final SamePriceOrderListComparator COMPARE_SELL = new SamePriceOrderListComparator(Direction.SELL);

    @Getter
    private final List<SamePriceOrderList> priceOrdersList;
    private final ReentrantLock lock = new ReentrantLock();
    private final Direction direction;

    public BookOrder(final Pair currencyChange, final Direction direction) {

        this.currencyChange = currencyChange;
        this.priceOrdersList = new ArrayList<>();
        this.direction = direction;
    }

    public boolean addOrderTicket(final OrderTicket ticket, final boolean addAsFirstElement) throws ExchangeException {

        if (!ticket.getPair().equals(this.currencyChange))
            return false;

        lock.lock();
        for (final SamePriceOrderList element : priceOrdersList) {
            if (ticket.getRatio().equals(element.getRatio())) {
                if (addAsFirstElement) {
                    element.getList().addFirst(ticket);
                } else {
                    element.add(ticket);
                }
                lock.unlock();
                return true;
            }
        }
        SamePriceOrderList newList = new SamePriceOrderList(currencyChange, direction, ticket.getRatio());
        newList.add(ticket);
        priceOrdersList.add(newList);
        if (Direction.BUY.equals(direction)) {
            priceOrdersList.sort(COMPARE_BUY);
        } else {
            priceOrdersList.sort(COMPARE_SELL);
        }
        lock.unlock();
        return true;

    }

    @Override
    public String toString() {

        StringBuilder builder = new StringBuilder();
        builder.append(String.format("From : '%s' exchangeAB: '%s'", currencyChange, direction));
        builder.append("\n\r");
        for (final SamePriceOrderList elem : priceOrdersList) {
            builder.append(String.format("Exchange ratio: %s count: %s\n\r", elem.getRatio(), elem.getList().size()));
            builder.append(elem);
        }
        return builder.toString();
    }

    public boolean backOrderTicketToList(final OrderTicket ticket) throws ExchangeException {

        OrderTicket firstTicket = getFirstElement();
        if ((firstTicket != null) && (firstTicket.getId().equals(ticket.getId()))) {
            return overrideTicketValue(firstTicket, ticket);
        } else {
            return addOrderTicket(ticket, true);
        }
    }

    private boolean overrideTicketValue(final OrderTicket firstTicket, final OrderTicket ticket) {
        boolean retValue;
        if (firstTicket.getId().equals(ticket.getId()) && firstTicket.getIdUser().equals(ticket.getIdUser())
                && firstTicket.getIdCurrency().equalsIgnoreCase(ticket.getIdCurrency()) && firstTicket.getRatio()
                .equals(ticket.getRatio()) && firstTicket.getTicketDateUTC().equals(ticket.getTicketDateUTC())
                && firstTicket.getPair().equals(ticket.getPair()) && direction.equals(ticket.getDirection())) {
            firstTicket.setValueAmount(ticket.getValueAmount());
            retValue = true;
        } else {
            retValue = false;
        }
        return retValue;
    }

    public boolean removeCancelled(final @NotNull OrderTicket ticket) {

        OrderTicket firstTicket = getFirstElement();
        if ((firstTicket != null) && (firstTicket.getId().equals(ticket.getId()))) {
            return removeFirstElement(firstTicket);
        }
        return false;
    }

    public OrderTicket getFirstElement() {

        lock.lock();
        if (!priceOrdersList.isEmpty()) {

            SamePriceOrderList firstSamePriceOrderList = priceOrdersList.getFirst();
            List<OrderTicket> orderTicketList = firstSamePriceOrderList.getList();
            if (!orderTicketList.isEmpty()) {
                lock.unlock();
                return orderTicketList.getFirst();
            }

        }
        lock.unlock();
        return null;
    }

    public boolean removeFirstElement(final @NotNull OrderTicket ticket) {

        lock.lock();
        if (!priceOrdersList.isEmpty()) {
            boolean removeResult = false;
            SamePriceOrderList firstSamePriceOrderList = priceOrdersList.getFirst();
            List<OrderTicket> orderTicketList = firstSamePriceOrderList.getList();
            if (!orderTicketList.isEmpty()) {
                removeResult = orderTicketList.remove(ticket);
            }
            if (orderTicketList.isEmpty()) {
                priceOrdersList.remove(firstSamePriceOrderList);
            }
            lock.unlock();
            return removeResult;

        }
        lock.unlock();
        return false;
    }

    public int getPriceOrdersListSize() {

        return priceOrdersList.size();
    }

    public OrderTicket removeOrder(final Long id) {

        for (final SamePriceOrderList samePriceOrderList : priceOrdersList) {
            for (final OrderTicket ticket : samePriceOrderList.getList()) {
                if (ticket.getId().equals(id)) {
                    if (removeTicket(samePriceOrderList, ticket)) {
                        return ticket;
                    }
                }
            }
        }
        return null;
    }

    private boolean removeTicket(SamePriceOrderList samePriceOrderList, OrderTicket ticket) {
        boolean retValue;
        retValue = samePriceOrderList.removeTicket(ticket);
        if (samePriceOrderList.getList().isEmpty()) {
            priceOrdersList.remove(samePriceOrderList);
        }
        return retValue;
    }

    public void checkIfFinishOrder(final OrderTicket orderTicket, final OrderTicket exchangeTicket)
            throws ExchangeException {
        if (exchangeTicket.getValueAmount().compareTo(ONE_CENT.multiply(orderTicket.getRatio()).add(ONE_CENT)) >= 0) {
            addOrderTicket(exchangeTicket, true);
        } else {
            orderTicket.setFinishOrder(true);
            exchangeTicket.setFinishOrder(true);
        }
    }
}
