package exchange.data;

import exchange.app.api.model.Direction;
import exchange.app.api.model.Pair;
import exchange.builders.CoreTicket;
import exchange.utils.OrderUtils;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class OrderTicketTest {
    private final long epoch = System.currentTimeMillis();

    @Test
    public final void testTransactionTicket() {
        CoreTicket ticket = new CoreTicket(1L, 100_0000, 4_1000, epoch);
        assertEquals(100_0000, ticket.getValue());
        assertEquals(4_1000, ticket.getRatio());
        ticket = new CoreTicket(2L, 100_0000, 4_2000, epoch);
        assertEquals(100_0000, ticket.getValue());
        assertEquals(4_2000, ticket.getRatio());

    }

    @Test
    public final void testSplit_should_generateException_when_valueToSplitGreaterThanValueOfTheTicket() {
        Throwable exception = assertThrows(ArithmeticException.class, () -> {
            CoreTicket ticket = new CoreTicket(1L, 20_0000, 3_0000, epoch, Pair.EUR_PLN, Direction.SELL);
            OrderUtils.split(ticket, 21_0000, epoch, 1L);
        });
        assertEquals(exception.getMessage(), "Value to subtract 210000 is bigger than current value 200000");
    }

    @Test
    public final void testSplit() {
        CoreTicket ticket = new CoreTicket(1L, 200_0000, 3_0000, epoch, Pair.EUR_PLN, Direction.SELL);
        CoreTicket ticketAfterSplit = OrderUtils.split(ticket, 50_0000, epoch, 1L);
        assertNotNull(ticketAfterSplit);
        assertEquals(50_0000, ticketAfterSplit.getValue());
    }

    @Test
    public final void roundingTest() {
        CoreTicket ticket = new CoreTicket(1L, 200_0001, 3_0001, epoch, Pair.EUR_PLN, Direction.SELL);
        assertEquals("valueAmount : '200.00' EUR ratio : '3.0001'", ticket.toString());
        assertEquals(new BigDecimal("200.00"), ticket.getFinancialValue());
        ticket = new CoreTicket(1L, 200_0099, 3_0001, epoch, Pair.EUR_PLN, Direction.SELL);
        assertEquals("valueAmount : '200.00' EUR ratio : '3.0001'", ticket.toString());
        assertEquals(new BigDecimal("200.00"), ticket.getFinancialValue());
    }


}
