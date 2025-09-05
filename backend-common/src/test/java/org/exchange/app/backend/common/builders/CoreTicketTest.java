package org.exchange.app.backend.common.builders;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.common.api.model.Direction.SELL;
import static org.exchange.app.common.api.model.Pair.EUR_PLN;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.UUID;
import org.junit.jupiter.api.Test;

class CoreTicketTest {

  @Test
  public final void newAmount_should_generateException_when_newValueToBiggerThanValueOfTheTicket() {
    Throwable exception = assertThrows(ArithmeticException.class, () -> {
      CoreTicket ticket = new CoreTicket(1L, 20_0000, 3_0000, UUID.randomUUID(), EUR_PLN, SELL);
      ticket.newAmount(21_0000, 1L);
    });
    assertThat(exception.getMessage()).isEqualTo(
        "Amount 210000 is bigger than current value 200000");
  }

  @Test
  public final void newAmount_should_returnNewTicketWithNewValue_when_methodIsCalled() {
    CoreTicket ticket = new CoreTicket(1L, 200_0000, 3_0000, UUID.randomUUID(), EUR_PLN, SELL);
    long newAmount = 50_0000;
    CoreTicket ticketAfterSplit = ticket.newAmount(newAmount, 1L);
    assertThat(ticketAfterSplit).isNotNull();
    assertThat(ticketAfterSplit.getAmount()).isEqualTo(newAmount);
  }
}