package org.exchange.internal.app.core.data;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.common.api.model.Direction.SELL;
import static org.exchange.app.common.api.model.Pair.EUR_PLN;

import java.util.UUID;
import org.exchange.internal.app.core.builders.CoreTicket;
import org.junit.jupiter.api.Test;

public class OrderTicketTest {

  private final long epoch = System.currentTimeMillis();

  @Test
  public final void constructor_should_setCorrectAmountAndRatio_when_called() {
    CoreTicket ticket = new CoreTicket(1L, 100_0000, 4_1000, epoch, UUID.randomUUID());
    assertThat(ticket.getAmount()).isEqualTo(100_0000);
    assertThat(ticket.getRatio()).isEqualTo(4_1000);
    ticket = new CoreTicket(2L, 100_0000, 4_2000, epoch, UUID.randomUUID());
    assertThat(ticket.getAmount()).isEqualTo(100_0000);
    assertThat(ticket.getRatio()).isEqualTo(4_2000);

  }


  @Test
  public final void constructor_should_setCorrectAmount_when_called() {
    CoreTicket ticket = new CoreTicket(1L, 200_0001, 3_0001, epoch, UUID.randomUUID(), EUR_PLN,
        SELL);
    assertThat(ticket.toString()).isEqualTo("amount : '200.00' EUR ratio : '3.0001'");
    assertThat(ticket.getAmount()).isEqualTo(2000001);
    ticket = new CoreTicket(1L, 200_0099, 3_0001, epoch, UUID.randomUUID(), EUR_PLN, SELL);
    assertThat(ticket.toString()).isEqualTo("amount : '200.00' EUR ratio : '3.0001'");
    assertThat(ticket.getAmount()).isEqualTo(2000099);
  }


}
