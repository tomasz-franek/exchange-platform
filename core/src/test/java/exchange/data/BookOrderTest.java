package exchange.data;


import exchange.app.api.model.Direction;
import exchange.app.api.model.Pair;
import exchange.builders.CoreTicket;
import exchange.builders.OrderTicketBuilder;
import exchange.exceptions.ExchangeException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class BookOrderTest {

    @Test
    public final void testBookOrder() throws ExchangeException {
        BookOrder book = new BookOrder(Pair.EUR_PLN, Direction.BUY);
        book.addOrderTicket(OrderTicketBuilder.createBuilder().withId(1L).withIdUser(1L).withPair(Pair.EUR_PLN)
                .withDirection(Direction.BUY).withRatio("4.0021").withValueAmount("20").build(), false);
        book.addOrderTicket(OrderTicketBuilder.createBuilder().withId(2L).withIdUser(1L).withPair(Pair.EUR_PLN)
                .withDirection(Direction.BUY).withRatio("4.0021").withValueAmount("20").build(), false);
        book.addOrderTicket(OrderTicketBuilder.createBuilder().withId(3L).withIdUser(1L).withPair(Pair.EUR_PLN)
                .withDirection(Direction.BUY).withRatio("4.0022").withValueAmount("20").build(), false);
        book.addOrderTicket(OrderTicketBuilder.createBuilder().withId(4L).withIdUser(1L).withPair(Pair.EUR_PLN)
                .withDirection(Direction.BUY).withRatio("4.0022").withValueAmount("20").build(), false);
        book.addOrderTicket(OrderTicketBuilder.createBuilder().withId(4L).withIdUser(1L).withPair(Pair.EUR_PLN)
                .withDirection(Direction.BUY).withRatio("4.0023").withValueAmount("20").build(), false);
        book.addOrderTicket(OrderTicketBuilder.createBuilder().withId(4L).withIdUser(1L).withPair(Pair.EUR_PLN)
                .withDirection(Direction.BUY).withRatio("4.0024").withValueAmount("20").build(), false);

        BookOrder book2 = new BookOrder(Pair.EUR_PLN, Direction.SELL);
        book2.addOrderTicket(OrderTicketBuilder.createBuilder().withId(4L).withIdUser(1L).withPair(Pair.EUR_PLN)
                .withDirection(Direction.SELL).withRatio("4.0021").withValueAmount("20").build(), false);
        book2.addOrderTicket(OrderTicketBuilder.createBuilder().withId(4L).withIdUser(1L).withPair(Pair.EUR_PLN)
                .withDirection(Direction.SELL).withRatio("4.0021").withValueAmount("20").build(), false);
        book2.addOrderTicket(OrderTicketBuilder.createBuilder().withId(4L).withIdUser(1L).withPair(Pair.EUR_PLN)
                .withDirection(Direction.SELL).withRatio("4.0022").withValueAmount("20").build(), false);
        book2.addOrderTicket(OrderTicketBuilder.createBuilder().withId(4L).withIdUser(1L).withPair(Pair.EUR_PLN)
                .withDirection(Direction.SELL).withRatio("4.0022").withValueAmount("20").build(), false);
        book2.addOrderTicket(OrderTicketBuilder.createBuilder().withId(4L).withIdUser(1L).withPair(Pair.EUR_PLN)
                .withDirection(Direction.SELL).withRatio("4.0023").withValueAmount("20").build(), false);
        book2.addOrderTicket(OrderTicketBuilder.createBuilder().withId(4L).withIdUser(1L).withPair(Pair.EUR_PLN)
                .withDirection(Direction.SELL).withRatio("4.0024").withValueAmount("20").build(), false);
    }

    @Test
    public final void testAddOrderTicket() throws ExchangeException {
        BookOrder book = new BookOrder(Pair.EUR_PLN, Direction.BUY);
        book.addOrderTicket(OrderTicketBuilder.createBuilder().withId(2L).withIdUser(1L).withPair(Pair.EUR_PLN)
                .withDirection(Direction.BUY).withRatio("4.0021").withValueAmount("20").build(), false);
    }

    @Test
    public final void testRemoveOrderTicket() throws ExchangeException {
        BookOrder book = new BookOrder(Pair.EUR_PLN, Direction.BUY);
        book.addOrderTicket(OrderTicketBuilder.createBuilder().withId(2L).withIdUser(1L).withPair(Pair.EUR_PLN)
                .withDirection(Direction.BUY).withRatio("4.0021").withValueAmount("20").build(), false);
        book.removeOrder(2L);
        assertNull(book.getFirstElement());
        assertNull(book.removeOrder(3L));
        assertNull(book.removeOrder(null));
    }

    @Test
    public final void testAddOrderTicketBuy() throws ExchangeException {
        BookOrder book = new BookOrder(Pair.EUR_PLN, Direction.BUY);

        for (int i = 1; i < 101; i++) {
            book.addOrderTicket(OrderTicketBuilder.createBuilder().withId(1L).withIdUser(1L).withPair(Pair.EUR_PLN)
                    .withDirection(Direction.BUY).withRatio(i).withValueAmount("1").build(), false);
        }
        for (int i = 0; i < 100; i++) {
            assertEquals(book.getPriceOrdersList().get(i).getList().getFirst().getRatio(), 100 - i);
        }
        for (int i = 0; i < 100; i++) {
            CoreTicket element = book.getFirstElement();
            assert element != null;
            assertEquals(element.getRatio(), 100 - i);
            book.removeFirstElement(element);
        }
    }

    @Test
    public final void testAddOrderTicketSell() throws ExchangeException {
        BookOrder book = new BookOrder(Pair.EUR_PLN, Direction.SELL);

        for (int i = 1; i < 101; i++) {
            book.addOrderTicket(OrderTicketBuilder.createBuilder().withId(1L).withIdUser(1L).withPair(Pair.EUR_PLN)
                    .withDirection(Direction.SELL).withRatio(i).withValueAmount(1).build(), false);
        }
        for (int i = 0; i < 100; i++) {
            assertEquals(book.getPriceOrdersList().get(i).getList().getFirst().getRatio(), i + 1);
        }
        for (int i = 0; i < 100; i++) {
            CoreTicket element = book.getFirstElement();
            assertEquals(book.getFirstElement().getRatio(), i + 1);
            assert element != null;
            book.removeFirstElement(element);
        }
    }

    @Test
    public final void testRemoveOrder() throws ExchangeException {
        BookOrder book = new BookOrder(Pair.EUR_PLN, Direction.SELL);

        book.removeOrder(1L);

        for (int i = 1; i < 3; i++) {
            book.addOrderTicket(OrderTicketBuilder.createBuilder().withId(1L).withIdUser(1L).withPair(Pair.EUR_PLN)
                    .withDirection(Direction.SELL).withRatio(i).withValueAmount(1).build(), false);
        }
        book.removeOrder(2L);
        for (int i = 1; i < 4; i++) {
            book.removeOrder(1L);
        }
    }

    @Test
    public final void testAddOrderFirst() throws ExchangeException {
        BookOrder book2 = new BookOrder(Pair.EUR_PLN, Direction.SELL);
        for (long i = 1; i <= 10; i++) {
            book2.addOrderTicket(
                    OrderTicketBuilder.createBuilder().withId(i).withPair(Pair.EUR_PLN).withDirection(Direction.SELL)
                            .withRatio("4.0000").withValueAmount("20").build(), false);
        }
        for (long i = 1; i <= 10; i++) {
            CoreTicket ticket = book2.getFirstElement();
            assert ticket != null;
            assertEquals((long) ticket.getId(), i);
            assertTrue(book2.removeFirstElement(ticket));
        }
    }

    @Test
    public final void testAddOrderReverse() throws ExchangeException {
        BookOrder bookOrder = new BookOrder(Pair.EUR_PLN, Direction.SELL);
        for (long i = 1; i <= 10; i++) {
            bookOrder.addOrderTicket(OrderTicketBuilder.createBuilder().withId(i).withIdUser(i).withPair(Pair.EUR_PLN)
                    .withDirection(Direction.SELL).withRatio("4.0000").withValueAmount("20").build(), true);
        }
        for (long i = 1; i <= 10; i++) {
            CoreTicket ticket = bookOrder.getFirstElement();
            assertEquals(ticket.getId(), 11 - i);
            assertTrue(bookOrder.removeFirstElement(ticket));
        }
    }
}
