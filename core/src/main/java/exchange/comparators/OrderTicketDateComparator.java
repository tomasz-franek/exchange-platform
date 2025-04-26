package exchange.comparators;

import exchange.app.api.model.OrderTicket;

import java.util.Comparator;

public class OrderTicketDateComparator implements Comparator<OrderTicket> {

    @Override
    public int compare(final OrderTicket arg0, final OrderTicket arg1) {
        assert arg1.getTicketDateUTC() != null;
        assert arg0.getTicketDateUTC() != null;
        return arg0.getTicketDateUTC().compareTo(arg1.getTicketDateUTC());
    }
}