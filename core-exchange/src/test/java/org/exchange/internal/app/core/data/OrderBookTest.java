package org.exchange.internal.app.core.data;


import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Direction.SELL;
import static org.exchange.app.common.api.model.Pair.CHF_PLN;
import static org.exchange.app.common.api.model.Pair.EUR_PLN;

import java.util.Optional;
import java.util.UUID;
import org.assertj.core.api.AssertionsForClassTypes;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.builders.CoreTicketBuilder;
import org.exchange.app.backend.common.builders.CoreTicketProperties;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;

public class OrderBookTest {

  @Test
  public final void testBookOrder() {
    OrderBook orderBookBuy = new OrderBook(EUR_PLN, BUY);
    orderBookBuy.addTicket(
        CoreTicketBuilder.createBuilder().withId(1L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withAmount("20").build(), false);
    orderBookBuy.addTicket(
        CoreTicketBuilder.createBuilder().withId(2L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withAmount("20").build(), false);
    orderBookBuy.addTicket(
        CoreTicketBuilder.createBuilder().withId(3L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0022").withAmount("20").build(), false);
    orderBookBuy.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0022").withAmount("20").build(), false);
    orderBookBuy.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0023").withAmount("20").build(), false);
    orderBookBuy.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0024").withAmount("20").build(), false);
    for (int i = 1; i < orderBookBuy.immutableCopySamePriceOrderList().size(); i++) {
      assertThat(orderBookBuy.immutableCopySamePriceOrderList().get(i).getRatio()).isLessThan(
          orderBookBuy.immutableCopySamePriceOrderList().get(i - 1).getRatio()
      );
    }
    OrderBook orderBookSell = new OrderBook(EUR_PLN, SELL);
    orderBookSell.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0021").withAmount("20").build(),
        false);
    orderBookSell.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0021").withAmount("20").build(),
        false);
    orderBookSell.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0022").withAmount("20").build(),
        false);
    orderBookSell.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0022").withAmount("20").build(),
        false);
    orderBookSell.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0023").withAmount("20").build(),
        false);
    orderBookSell.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0024").withAmount("20").build(),
        false);
    for (int i = 1; i < orderBookSell.immutableCopySamePriceOrderList().size(); i++) {
      assertThat(orderBookSell.immutableCopySamePriceOrderList().get(i).getRatio()).isGreaterThan(
          orderBookSell.immutableCopySamePriceOrderList().get(i - 1).getRatio()
      );
    }
  }

  @Test
  public final void addTicket_should_setPriceOrderListSizeToOne_when_noTicketsWithTheSameRatio() {
    OrderBook book = new OrderBook(EUR_PLN, BUY);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(2L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withAmount("20").build(), false);
    assertThat(book.getPriceOrdersListSize()).isEqualTo(1);
  }

  @Test
  public final void removeOrder_should_returnNull_when_orderBookIsEmpty() {
    OrderBook book = new OrderBook(EUR_PLN, BUY);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(2L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withAmount("20").build(), false);
    book.removeOrder(2L);
    assertThat(book.getFirstElement()).isEqualTo(Optional.empty());
  }

  @Test
  public final void removeOrder_should_returnNull_when_orderWithIdIsNotInTheOrderBook() {
    OrderBook book = new OrderBook(EUR_PLN, BUY);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(2L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withAmount("20").build(), false);
    book.removeOrder(2L);
    assertThat(book.removeOrder(3L)).isEqualTo(Optional.empty());
    assertThat(book.removeOrder(null)).isEqualTo(Optional.empty());
  }

  @Test
  public final void removeOrder_should_returnNull_when_orderIsNull() {
    OrderBook book = new OrderBook(EUR_PLN, BUY);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(2L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withAmount("20").build(), false);
    book.removeOrder(2L);
    assertThat(book.removeOrder(null)).isEqualTo(Optional.empty());
  }


  @Test
  public final void addTicket_should_orderBuyTicketsInCorrectOrders_when_ticketsAddedToOrderBook() {
    OrderBook book = new OrderBook(EUR_PLN, BUY);

    for (int i = 1; i < 101; i++) {
      book.addTicket(
          CoreTicketBuilder.createBuilder().withId(1L).withUserId(UUID.randomUUID())
              .withPair(EUR_PLN)
              .withDirection(BUY).withRatio(i).withAmount("1").build(), false);
    }
    for (int i = 0; i < 100; i++) {
      assertThat(
          book.immutableCopySamePriceOrderList().get(i).getList().getFirst().getRatio()).isEqualTo(
          100 - i);
    }
    for (int i = 0; i < 100; i++) {
      Optional<CoreTicket> element = book.getFirstElement();
      assertThat(element.isPresent()).isTrue();
      assertThat(element.get().getRatio()).isEqualTo(100 - i);
      book.removeFirstElement(element.get());
    }
  }

  @Test
  public final void addTicket_should_orderSellTicketsInCorrectOrders_when_ticketsAddedToOrderBook() {
    OrderBook book = new OrderBook(EUR_PLN, SELL);

    for (long i = 1; i < 101; i++) {
      book.addTicket(
          CoreTicketBuilder.createBuilder().withId(i).withUserId(UUID.randomUUID())
              .withPair(EUR_PLN)
              .withDirection(SELL).withRatio(i).withAmount(i * CoreTicketProperties.ROUNDING)
              .build(), false);
    }
    for (int i = 0; i < 100; i++) {
      assertThat(
          book.immutableCopySamePriceOrderList().get(i).getList().getFirst().getRatio()).isEqualTo(
          i + 1);
    }
    for (long i = 0; i < 100; i++) {
      Optional<CoreTicket> element = book.getFirstElement();
      assertThat(element.isPresent()).isTrue();
      assertThat(book.getFirstElement().get().getRatio()).isEqualTo(i + 1);
      book.removeFirstElement(element.get());
    }
  }

  @Test
  public final void removeOrder_should_removeOrders_when_called() {
    OrderBook book = new OrderBook(EUR_PLN, SELL);

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
  public final void addOrderFirst_should_addOrdersInOrder_when_called() {
    OrderBook book2 = new OrderBook(EUR_PLN, SELL);
    for (long i = 1; i <= 10; i++) {
      book2.addTicket(
          CoreTicketBuilder.createBuilder().withId(i).withPair(EUR_PLN)
              .withDirection(SELL)
              .withUserId(UUID.randomUUID())
              .withRatio("4.0000").withAmount("20").build(), false);
    }
    for (long i = 1; i <= 10; i++) {
      Optional<CoreTicket> ticket = book2.getFirstElement();
      assertThat(ticket.isPresent()).isTrue();
      assertThat(ticket.get().getId()).isEqualTo(i);
      assertThat(book2.removeFirstElement(ticket.get())).isEqualTo(true);
    }
  }

  @Test
  public final void addOrderReverse_should_addOrdersInReverseOrder_wh() {
    OrderBook orderBook = new OrderBook(EUR_PLN, SELL);
    for (long i = 1; i <= 10; i++) {
      orderBook.addTicket(
          CoreTicketBuilder.createBuilder().withId(i).withUserId(UUID.randomUUID())
              .withPair(EUR_PLN)
              .withDirection(SELL).withRatio("4.0000").withAmount("20").build(),
          true);
    }
    for (long i = 1; i <= 10; i++) {
      Optional<CoreTicket> ticket = orderBook.getFirstElement();
      assertThat(ticket.isPresent()).isTrue();
      assertThat(ticket.get().getId()).isEqualTo(11 - i);
      assertThat(orderBook.removeFirstElement(ticket.get())).isTrue();
    }
  }

  @Test
  public final void backOrderTicketToList_should_updateValueAmount_when_theSameTicketId() {
    OrderBook orderBook = new OrderBook(EUR_PLN, SELL);
    orderBook.addTicket(
        CoreTicketBuilder.createBuilder().withId(1L).withUserId(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0000").withAmount("200").build(),
        true);
    Optional<CoreTicket> ticket = orderBook.getFirstElement();
    assertThat(ticket.isPresent()).isTrue();

    CoreTicket ticketWithNewAmount = ticket.get().newAmount(40_0000, 2);
    orderBook.backOrderTicketToList(ticketWithNewAmount);
    Optional<CoreTicket> ticketUpdated = orderBook.getFirstElement();
    assertThat(ticketUpdated.isPresent()).isTrue();
    assertThat(ticketUpdated.get().getAmount()).isEqualTo(ticketWithNewAmount.getAmount());
  }

  @Test
  public void removeFirstElement_should_ReturnNull_when_orderBookIsEmpty() {
    OrderBook orderBook = new OrderBook(CHF_PLN, SELL);
    AssertionsForClassTypes.assertThat(orderBook
            .removeFirstElement(new CoreTicket(1L, 1, 1, 1, UUID.randomUUID())))
        .isEqualTo(false);
  }

  @Test
  public void removeFirstElement_shouldReturnTrueAndRemoveSamePriceOrderList_when_removeLastElementFromSamePriceOrderList() {
    OrderBook orderBook = new OrderBook(Pair.CHF_PLN, SELL);
    assertThat(orderBook.removeFirstElement(new CoreTicket(1L, 1, 1, 1, UUID.randomUUID())))
        .isEqualTo(false);
  }

  @Test
  void removeFirstElement_should_decreaseSumAmountForPriceOrderList_when_ticketRemovedFromPriceOrderList() {
    Pair pair = Pair.CHF_PLN;
    Direction direction = SELL;
    OrderBook orderBook = new OrderBook(pair, direction);
    orderBook.addTicket(CoreTicketBuilder.createBuilder()
        .withId(1L)
        .withAmount(100_0000)
        .withDirection(direction)
        .withPair(pair)
        .withUserId(UUID.randomUUID())
        .withEpochUTC(1L)
        .withRatio(1).build(), false);
    orderBook.addTicket(CoreTicketBuilder.createBuilder()
        .withId(2L)
        .withAmount(120_0000)
        .withDirection(direction)
        .withPair(pair)
        .withUserId(UUID.randomUUID())
        .withEpochUTC(1L)
        .withRatio(1).build(), false);

    assertThat(
        orderBook.immutableCopySamePriceOrderList().getFirst().getSumAmount().intValue()).isEqualTo(
        220_0000);
    orderBook.immutableCopySamePriceOrderList().getFirst().removeFirst();
    assertThat(
        orderBook.immutableCopySamePriceOrderList().getFirst().getSumAmount().intValue()).isEqualTo(
        120_0000);
  }
}
