package exchange.data;


import static exchange.app.api.model.Direction.BUY;
import static exchange.app.api.model.Direction.SELL;
import static exchange.app.api.model.Pair.EUR_PLN;
import static org.assertj.core.api.Assertions.assertThat;

import exchange.builders.CoreTicket;
import exchange.builders.CoreTicketBuilder;
import exchange.builders.CoreTicketProperties;
import exchange.exceptions.ExchangeException;
import org.junit.jupiter.api.Test;

public class BookOrderTest {

  @Test
  public final void testBookOrder() throws ExchangeException {
    BookOrder book = new BookOrder(EUR_PLN, BUY);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(1L).withIdUser(1L).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withValueAmount("20").build(), false);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(2L).withIdUser(1L).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withValueAmount("20").build(), false);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(3L).withIdUser(1L).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0022").withValueAmount("20").build(), false);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withIdUser(1L).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0022").withValueAmount("20").build(), false);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withIdUser(1L).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0023").withValueAmount("20").build(), false);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withIdUser(1L).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0024").withValueAmount("20").build(), false);

    BookOrder book2 = new BookOrder(EUR_PLN, SELL);
    book2.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withIdUser(1L).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0021").withValueAmount("20").build(),
        false);
    book2.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withIdUser(1L).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0021").withValueAmount("20").build(),
        false);
    book2.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withIdUser(1L).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0022").withValueAmount("20").build(),
        false);
    book2.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withIdUser(1L).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0022").withValueAmount("20").build(),
        false);
    book2.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withIdUser(1L).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0023").withValueAmount("20").build(),
        false);
    book2.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withIdUser(1L).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0024").withValueAmount("20").build(),
        false);
  }

  @Test
  public final void testAddOrderTicket() throws ExchangeException {
    BookOrder book = new BookOrder(EUR_PLN, BUY);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(2L).withIdUser(1L).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withValueAmount("20").build(), false);
    assertThat(book.getPriceOrdersListSize()).isEqualTo(1);
  }

  @Test
  public final void testRemoveOrderTicket() throws ExchangeException {
    BookOrder book = new BookOrder(EUR_PLN, BUY);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(2L).withIdUser(1L).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withValueAmount("20").build(), false);
    book.removeOrder(2L);
    assertThat(book.getFirstElement()).isNull();
    assertThat(book.removeOrder(3L)).isNull();
    assertThat(book.removeOrder(null)).isNull();
  }

  @Test
  public final void testAddOrderTicketBuy() throws ExchangeException {
    BookOrder book = new BookOrder(EUR_PLN, BUY);

    for (int i = 1; i < 101; i++) {
      book.addTicket(
          CoreTicketBuilder.createBuilder().withId(1L).withIdUser(1L).withPair(EUR_PLN)
              .withDirection(BUY).withRatio(i).withValueAmount("1").build(), false);
    }
    for (int i = 0; i < 100; i++) {
      assertThat(book.getPriceOrdersList().get(i).getList().getFirst().getRatio()).isEqualTo(
          100 - i);
    }
    for (int i = 0; i < 100; i++) {
      CoreTicket element = book.getFirstElement();
      assert element != null;
      assertThat(element.getRatio()).isEqualTo(100 - i);
      book.removeFirstElement(element);
    }
  }

  @Test
  public final void testAddOrderTicketSell() throws ExchangeException {
    BookOrder book = new BookOrder(EUR_PLN, SELL);

    for (long i = 1; i < 101; i++) {
      book.addTicket(
          CoreTicketBuilder.createBuilder().withId(i).withIdUser(i).withPair(EUR_PLN)
              .withDirection(SELL).withRatio(i).withValueAmount(i * CoreTicketProperties.ROUNDING)
              .build(), false);
    }
    for (int i = 0; i < 100; i++) {
      assertThat(book.getPriceOrdersList().get(i).getList().getFirst().getRatio()).isEqualTo(i + 1);
    }
    for (long i = 0; i < 100; i++) {
      CoreTicket element = book.getFirstElement();
      assertThat(book.getFirstElement().getRatio()).isEqualTo(i + 1);
      assert element != null;
      book.removeFirstElement(element);
    }
  }

  @Test
  public final void testRemoveOrder() throws ExchangeException {
    BookOrder book = new BookOrder(EUR_PLN, SELL);

    book.removeOrder(1L);

    for (int i = 1; i < 3; i++) {
      book.addTicket(
          CoreTicketBuilder.createBuilder().withId(1L).withIdUser(1L).withPair(EUR_PLN)
              .withDirection(SELL).withRatio(i).withValueAmount(1).build(), false);
    }
    book.removeOrder(2L);
    for (int i = 1; i < 4; i++) {
      book.removeOrder(1L);
    }
  }

  @Test
  public final void testAddOrderFirst() throws ExchangeException {
    BookOrder book2 = new BookOrder(EUR_PLN, SELL);
    for (long i = 1; i <= 10; i++) {
      book2.addTicket(
          CoreTicketBuilder.createBuilder().withId(i).withPair(EUR_PLN)
              .withDirection(SELL)
              .withIdUser(1L)
              .withRatio("4.0000").withValueAmount("20").build(), false);
    }
    for (long i = 1; i <= 10; i++) {
      CoreTicket ticket = book2.getFirstElement();
      assert ticket != null;
      assertThat(ticket.getId()).isEqualTo(i);
      assertThat(book2.removeFirstElement(ticket)).isEqualTo(true);
    }
  }

  @Test
  public final void testAddOrderReverse() throws ExchangeException {
    BookOrder bookOrder = new BookOrder(EUR_PLN, SELL);
    for (long i = 1; i <= 10; i++) {
      bookOrder.addTicket(
          CoreTicketBuilder.createBuilder().withId(i).withIdUser(i).withPair(EUR_PLN)
              .withDirection(SELL).withRatio("4.0000").withValueAmount("20").build(),
          true);
    }
    for (long i = 1; i <= 10; i++) {
      CoreTicket ticket = bookOrder.getFirstElement();
      assertThat(ticket.getId()).isEqualTo(11 - i);
      assertThat(bookOrder.removeFirstElement(ticket)).isTrue();
    }
  }
}
