package exchange.data;

import exchange.app.api.model.Direction;
import exchange.app.api.model.ExchangeTicket;
import exchange.app.api.model.OrderTicket;
import exchange.app.api.model.Pair;
import exchange.utils.CurrencyUtils;
import exchange.utils.OrderUtils;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

public class OrderTicketTest {

    @Test
    public final void testTransactionTicket() {
        String idCurrency = CurrencyUtils.pairToCurrency(Pair.EUR_PLN, Direction.SELL);
        OrderTicket ticket = new OrderTicket(1L, 1L, Pair.EUR_PLN, Direction.SELL, LocalDateTime.now(),
                new BigDecimal("4.1"), new BigDecimal("100.0"), false, idCurrency, false, false);
        assertEquals(new BigDecimal("100.0"), ticket.getValueAmount());
        assertEquals(new BigDecimal("4.1"), ticket.getRatio());
        ticket = new OrderTicket(2L, 1L, Pair.EUR_PLN, Direction.SELL, LocalDateTime.now(), new BigDecimal("4.2"),
                new BigDecimal("100.0"), false, idCurrency, false, false);
        assertEquals(new BigDecimal("100.0"), ticket.getValueAmount());
        assertEquals(new BigDecimal("4.2"), ticket.getRatio());

    }

    @Test
    public final void testSplit() {
        String idCurrency = CurrencyUtils.pairToCurrency(Pair.EUR_PLN, Direction.SELL);
        OrderTicket ticket = new OrderTicket(1L, 1L, Pair.EUR_PLN, Direction.SELL, LocalDateTime.now(),
                new BigDecimal("3"), new BigDecimal("200"), false, idCurrency, false, false);
        ExchangeTicket ticket2;
        try {
            OrderUtils.split(ticket, new BigDecimal("201"), LocalDateTime.now(), 1L, ticket.getPair());
            fail();
        } catch (Exception e) {
            assertTrue(true);
        }
        ticket2 = OrderUtils.split(ticket, new BigDecimal("50"), LocalDateTime.now(), 1L, ticket.getPair());
        assertNotNull(ticket2);
        assertEquals(new BigDecimal("50"), ticket2.getValueAmount());
        assertEquals(new BigDecimal("150"), ticket.getValueAmount());
        assertEquals(new BigDecimal("200"), ticket.getValueAmount().add(ticket2.getValueAmount()));
    }

    @Test
    @Disabled("to be fixed")
    public final void roundingTest() {
        String idCurrency = CurrencyUtils.pairToCurrency(Pair.EUR_PLN, Direction.SELL);
        OrderTicket ticket = new OrderTicket(1L, 1L, Pair.EUR_PLN, Direction.SELL, LocalDateTime.now(),
                new BigDecimal("3.0001"), new BigDecimal("200.0001"), false, idCurrency, false, false);
        assertEquals("valueAmount : '200.00' EUR ratio : '3.0001'", ticket.toString());
        assertEquals(new BigDecimal("200.00"), ticket.getValueAmount());
        ticket = new OrderTicket(2L, 1L, Pair.EUR_PLN, Direction.SELL, LocalDateTime.now(), new BigDecimal("3.0001"),
                new BigDecimal("200.0099"), false, idCurrency, false, false);
        assertEquals("valueAmount : '200.00' EUR ratio : '3.0001'", ticket.toString());
        assertEquals(new BigDecimal("200.00"), ticket.getValueAmount());
    }


}
