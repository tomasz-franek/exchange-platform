package exchange.data;


import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Direction.SELL;
import static org.exchange.app.common.api.model.Pair.CHF_PLN;
import static org.exchange.app.common.api.model.Pair.EUR_PLN;

import java.util.UUID;
import org.assertj.core.api.AssertionsForClassTypes;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.exchange.builders.CoreTicket;
import org.exchange.builders.CoreTicketBuilder;
import org.exchange.builders.CoreTicketProperties;
import org.exchange.data.BookOrder;
import org.exchange.data.SamePriceOrderList;
import org.junit.jupiter.api.Test;

public class BookOrderTest {

  @Test
  public final void testBookOrder() {
    BookOrder book = new BookOrder(EUR_PLN, BUY);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(1L).withIdUser(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withValue("20").build(), false);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(2L).withIdUser(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withValue("20").build(), false);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(3L).withIdUser(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0022").withValue("20").build(), false);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withIdUser(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0022").withValue("20").build(), false);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withIdUser(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0023").withValue("20").build(), false);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withIdUser(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0024").withValue("20").build(), false);

    BookOrder book2 = new BookOrder(EUR_PLN, SELL);
    book2.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withIdUser(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0021").withValue("20").build(),
        false);
    book2.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withIdUser(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0021").withValue("20").build(),
        false);
    book2.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withIdUser(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0022").withValue("20").build(),
        false);
    book2.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withIdUser(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0022").withValue("20").build(),
        false);
    book2.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withIdUser(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0023").withValue("20").build(),
        false);
    book2.addTicket(
        CoreTicketBuilder.createBuilder().withId(4L).withIdUser(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0024").withValue("20").build(),
        false);
  }

  @Test
  public final void testAddOrderTicket() {
    BookOrder book = new BookOrder(EUR_PLN, BUY);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(2L).withIdUser(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withValue("20").build(), false);
    assertThat(book.getPriceOrdersListSize()).isEqualTo(1);
  }

  @Test
  public final void testRemoveOrderTicket() {
    BookOrder book = new BookOrder(EUR_PLN, BUY);
    book.addTicket(
        CoreTicketBuilder.createBuilder().withId(2L).withIdUser(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(BUY).withRatio("4.0021").withValue("20").build(), false);
    book.removeOrder(2L);
    assertThat(book.getFirstElement()).isNull();
    assertThat(book.removeOrder(3L)).isNull();
    assertThat(book.removeOrder(null)).isNull();
  }

  @Test
  public final void testAddOrderTicketBuy() {
    BookOrder book = new BookOrder(EUR_PLN, BUY);

    for (int i = 1; i < 101; i++) {
      book.addTicket(
          CoreTicketBuilder.createBuilder().withId(1L).withIdUser(UUID.randomUUID())
              .withPair(EUR_PLN)
              .withDirection(BUY).withRatio(i).withValue("1").build(), false);
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
          CoreTicketBuilder.createBuilder().withId(i).withIdUser(UUID.randomUUID())
              .withPair(EUR_PLN)
              .withDirection(SELL).withRatio(i).withValue(i * CoreTicketProperties.ROUNDING)
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
          CoreTicketBuilder.createBuilder().withId(1L).withIdUser(UUID.randomUUID())
              .withPair(EUR_PLN)
              .withDirection(SELL).withRatio(i).withValue(1).build(), false);
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
              .withIdUser(UUID.randomUUID())
              .withRatio("4.0000").withValue("20").build(), false);
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
          CoreTicketBuilder.createBuilder().withId(i).withIdUser(UUID.randomUUID())
              .withPair(EUR_PLN)
              .withDirection(SELL).withRatio("4.0000").withValue("20").build(),
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
        CoreTicketBuilder.createBuilder().withId(1L).withIdUser(UUID.randomUUID()).withPair(EUR_PLN)
            .withDirection(SELL).withRatio("4.0000").withValue("200").build(),
        true);
    CoreTicket ticket = bookOrder.getFirstElement();

    ticket = ticket.newValue(40_0000, 2);
    bookOrder.backOrderTicketToList(ticket);
    CoreTicket ticketUpdated = bookOrder.getFirstElement();
    assertThat(ticketUpdated.getValue()).isEqualTo(ticket.getValue());
  }

  @Test
  public void removeFirstElement_shouldReturnNull_when_orderBookIsEmpty() {
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
