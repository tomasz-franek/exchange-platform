package exchange.data;

import exchange.app.api.model.Direction;
import exchange.app.api.model.OrderTicket;
import exchange.app.api.model.Pair;
import exchange.comparators.OrderTicketDateComparator;
import exchange.exceptions.ExchangeException;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@ToString
@Log4j2
public final class SamePriceOrderList {

    private static final BigDecimal ZERO_SCALE_2 = BigDecimal.ZERO.setScale(2, RoundingMode.FLOOR);
    private static final BigDecimal ZERO_SCALE_4 = BigDecimal.ZERO.setScale(4, RoundingMode.FLOOR);
    private final Pair currencyChange;
    @Getter
    private final BigDecimal ratio;
    @Getter
    private final Direction direction;
    private final List<OrderTicket> orderTicketsList = new ArrayList<>();
    private static final OrderTicketDateComparator ORDER_TICKET_DATE_COMPARATOR = new OrderTicketDateComparator();

    public SamePriceOrderList(final Pair currencyChangeValue, final Direction direction, final BigDecimal ratio) {
        this.currencyChange = currencyChangeValue;
        this.ratio = ratio;
        this.direction = direction;
    }

    public void add(final OrderTicket ticket) throws ExchangeException {
        if ((ZERO_SCALE_2.equals(ticket.getValueAmount().setScale(2, RoundingMode.FLOOR))) || ZERO_SCALE_4.equals(
                ticket.getRatio().setScale(4, RoundingMode.FLOOR))) {
            throw new ExchangeException("Zero value from");
        }
        if (ticket.getPair().equals(currencyChange) && ticket.getRatio().equals(ratio) && ticket.getDirection()
                .equals(direction)) {
            orderTicketsList.add(ticket);
        } else {
            throw new ExchangeException(
                    String.format("Wrong list from : '%s' ratio '%s' operation: '%s' ", currencyChange, ratio,
                            direction) + ticket);
        }
    }

    public List<OrderTicket> getList() {
        return orderTicketsList;
    }

    public void addList(final List<OrderTicket> ticketList) throws ExchangeException {
        for (OrderTicket ticket : ticketList) {
            add(ticket);
        }
        orderTicketsList.sort(ORDER_TICKET_DATE_COMPARATOR);
    }

    public int size() {
        return orderTicketsList.size();
    }

    public void removeFirst() {
        orderTicketsList.removeFirst();
    }

    public boolean removeTicket(final OrderTicket ticket) {
        boolean result = orderTicketsList.remove(ticket);
        if (result) {
            log.debug("Remove ticket " + ticket.toString());
        }
        return result;
    }
}
