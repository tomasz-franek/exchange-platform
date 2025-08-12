package org.exchange.internal.app.core.data;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;

class SamePriceOrderListTest {

  @Test
  public void addList_should_sortOrderTicketList_when_ticketIsAdded() {
    SamePriceOrderList samePriceOrderList = new SamePriceOrderList(Pair.GBP_USD, Direction.BUY, 1);
    List<CoreTicket> ticketList = new ArrayList<>();
    for (long i = 10; i >= 1; i--) {
      ticketList.add(new CoreTicket(i, i, i, i, UUID.randomUUID()));
    }
    samePriceOrderList.addList(ticketList);
    assertThat(samePriceOrderList.getOrderTickets().size()).isEqualTo(ticketList.size());
    for (int i = 0; i < 10; i++) {
      assertThat(samePriceOrderList.getOrderTickets().get(i).getId()).isEqualTo(i + 1);
    }
  }

  @Test
  public void removeFirst_should_removeFirstElementFromOrderTicketList_when_methodCalled() {
    SamePriceOrderList samePriceOrderList = new SamePriceOrderList(Pair.GBP_USD, Direction.BUY, 1);
    List<CoreTicket> ticketList = new ArrayList<>();
    for (long i = 20; i >= 1; i--) {
      ticketList.add(new CoreTicket(i, i, i, i, UUID.randomUUID()));
    }
    samePriceOrderList.addList(ticketList);
    samePriceOrderList.removeFirst();
    assertThat(samePriceOrderList.getOrderTickets().size()).isEqualTo(ticketList.size() - 1);
    for (int i = 0; i < 19; i++) {
      assertThat(samePriceOrderList.getOrderTickets().get(i).getId()).isEqualTo(i + 2);
    }
  }

  @Test
  public void size_should_returnNumberOfElementsInOrderTicketList_when_methodCalled() {
    SamePriceOrderList samePriceOrderList = new SamePriceOrderList(Pair.GBP_USD, Direction.BUY, 5);
    List<CoreTicket> ticketList = new ArrayList<>();
    for (long i = 1; i <= 10; i++) {
      ticketList.add(new CoreTicket(i, i, 5, i, UUID.randomUUID()));
    }
    samePriceOrderList.addList(ticketList);
    assertThat(samePriceOrderList.size()).isEqualTo(ticketList.size());
    samePriceOrderList.removeFirst();
    samePriceOrderList.removeFirst();
    samePriceOrderList.removeFirst();

    assertThat(samePriceOrderList.size()).isEqualTo(ticketList.size() - 3);

  }

}