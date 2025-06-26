package org.exchange.internal.app.core.data;


import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Direction.SELL;
import static org.exchange.app.common.api.model.Pair.CHF_PLN;
import static org.exchange.app.common.api.model.Pair.EUR_PLN;

import java.util.UUID;
import org.assertj.core.api.AssertionsForClassTypes;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.exchange.internal.app.core.builders.CoreTicket;
import org.exchange.internal.app.core.builders.CoreTicketBuilder;
import org.exchange.internal.app.core.builders.CoreTicketProperties;
import org.junit.jupiter.api.Test;

public class BookOrderTest {

  @Test
  public final void testBookOrder() {
    BookOrder bookBuy = new BookOrder(EUR_PLN, BUY);
    bookBuy.addTicket(
        CoreTicketBuilder.createBuilder().withId(1L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withAmount("20").build(), false);
    bookBuy.addTicket(
        CoreTicketBuilder.createBuilder().withId(2L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withAmount("20").build(), false);
    bookBuy.addTicket(
        CoreTicketBuilder.createBuilder().withId(3L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0022").withAmount("20").build(), false);
    bookBuy.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0022").withAmount("20").build(), false);
    bookBuy.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0023").withAmount("20").build(), false);
    bookBuy.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0024").withAmount("20").build(), false);

    BookOrder bookSell = new BookOrder(EUR_PLN, SELL);
    bookSell.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0021").withAmount("20").build(),
        false);
    bookSell.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0021").withAmount("20").build(),
        false);
    bookSell.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0022").withAmount("20").build(),
        false);
    bookSell.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0022").withAmount("20").build(),
        false);
    bookSell.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0023").withAmount("20").build(),
        false);
    bookSell.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0024").withAmount("20").build(),
        false);
  }

  @Test
  public final void addTicket_should_setPriceOrderListSizeToOne_when_noTicketsWithTheSameRatio() {
    BookOrder book = new BookOrder(EUR_PLN, BUY);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(2L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withAmount("20").build(), false);
    assertThat(book.getPriceOrdersListSize()).isEqualTo(1);
  }

  @Test
  public final void removeOrder_should_returnNull_when_orderBookIsEmpty() {
    BookOrder book = new BookOrder(EUR_PLN, BUY);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(2L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withAmount("20").build(), false);
    book.removeOrder(2L);
    assertThat(book.getFirstElement()).isNull();
  }

  @Test
  public final void removeOrder_should_returnNull_when_orderWithIdIsNotInTheOrderBook() {
    BookOrder book = new BookOrder(EUR_PLN, BUY);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(2L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withAmount("20").build(), false);
    book.removeOrder(2L);
    assertThat(book.removeOrder(3L)).isNull();
    assertThat(book.removeOrder(null)).isNull();
  }

  @Test
  public final void removeOrder_should_returnNull_when_orderIsNull() {
    BookOrder book = new BookOrder(EUR_PLN, BUY);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(2L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withAmount("20").build(), false);
    book.removeOrder(2L);
    assertThat(book.removeOrder(null)).isNull();
  }


  @Test
  public final void testAddOrderTicketBuy() {
    BookOrder book = new BookOrder(EUR_PLN, BUY);

    for (int i = 1; i < 101; i++) {
      book.addTicket(
          CoreTicketBuilder.createBuilder().withId(1L).withUserId(UUID.randomUUID())
              .withPair(EUR_PLN)
              .withDirection(BUY).withRatio(i).withAmount("1").build(), false);
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
  public final void testAddOrderTicketSell() {
    BookOrder book = new BookOrder(EUR_PLN, SELL);

    for (long i = 1; i < 101; i++) {
      book.addTicket(
          CoreTicketBuilder.createBuilder().withId(i).withUserId(UUID.randomUUID())
              .withPair(EUR_PLN)
              .withDirection(SELL).withRatio(i).withAmount(i * CoreTicketProperties.ROUNDING)
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
  public final void testRemoveOrder() {
    BookOrder book = new BookOrder(EUR_PLN, SELL);

    book.removeOrder(1L);

    for (int i = 1; i < 3; i++) {
      book.addTicket(
          CoreTicketBuilder.createBuilder().withId(1L).withUserId(UUID.randomUUID())
              .withPair(EUR_PLN)
              .withDirection(SELL).withRatio(i).withAmount(10000).build(), false);
    }
    book.removeOrder(2L);
    for (int i = 1; i < 4; i++) {
      book.removeOrder(1L);
    }
  }

  @Test
  public final void testAddOrderFirst() {
    BookOrder book2 = new BookOrder(EUR_PLN, SELL);
    for (long i = 1; i <= 10; i++) {
      book2.addTicket(
          CoreTicketBuilder.createBuilder().withId(i).withPair(EUR_PLN)
              .withDirection(SELL)
              .withUserId(UUID.randomUUID())
              .withRatio("4.0000").withAmount("20").build(), false);
    }
    for (long i = 1; i <= 10; i++) {
      CoreTicket ticket = book2.getFirstElement();
      assert ticket != null;
      assertThat(ticket.getId()).isEqualTo(i);
      assertThat(book2.removeFirstElement(ticket)).isEqualTo(true);
    }
  }

  @Test
  public final void testAddOrderReverse() {
    BookOrder bookOrder = new BookOrder(EUR_PLN, SELL);
    for (long i = 1; i <= 10; i++) {
      bookOrder.addTicket(
          CoreTicketBuilder.createBuilder().withId(i).withUserId(UUID.randomUUID())
              .withPair(EUR_PLN)
              .withDirection(SELL).withRatio("4.0000").withAmount("20").build(),
          true);
    }
    for (long i = 1; i <= 10; i++) {
      CoreTicket ticket = bookOrder.getFirstElement();
      assertThat(ticket.getId()).isEqualTo(11 - i);
      assertThat(bookOrder.removeFirstElement(ticket)).isTrue();
    }
  }

  @Test
  public final void backOrderTicketToList_should_updateValueAmount_when_theSameTicketId() {
    BookOrder bookOrder = new BookOrder(EUR_PLN, SELL);
    bookOrder.addTicket(
        CoreTicketBuilder.createBuilder().withId(1L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0000").withAmount("200").build(),
        true);
    CoreTicket ticket = bookOrder.getFirstElement();

    ticket = ticket.newAmount(40_0000, 2);
    bookOrder.backOrderTicketToList(ticket);
    CoreTicket ticketUpdated = bookOrder.getFirstElement();
    assertThat(ticketUpdated.getAmount()).isEqualTo(ticket.getAmount());
  }

  @Test
  public void removeFirstElement_should_ReturnNull_when_orderBookIsEmpty() {
    BookOrder bookOrder = new BookOrder(CHF_PLN, SELL);
    AssertionsForClassTypes.assertThat(bookOrder
            .removeFirstElement(new CoreTicket(1L, 1, 1, 1, UUID.randomUUID())))
        .isEqualTo(false);
  }

  @Test
  public void removeFirstElement_shouldReturnTrueAndRemoveSamePriceOrderList_when_removeLastElementFromSamePriceOrderList() {
    Pair pair = Pair.CHF_PLN;
    Direction direction = SELL;
    BookOrder bookOrder = new BookOrder(pair, direction);
    bookOrder.getPriceOrdersList().add(new SamePriceOrderList(pair, direction, 1));
    bookOrder.getPriceOrdersList().add(new SamePriceOrderList(pair, direction, 2));
    AssertionsForClassTypes.assertThat(bookOrder
            .removeFirstElement(new CoreTicket(1L, 1, 1, 1, UUID.randomUUID())))
        .isEqualTo(false);
  }
}
