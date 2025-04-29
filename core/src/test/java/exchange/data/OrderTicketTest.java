package exchange.data;

import static org.junit.jupiter.api.Assertions.assertEquals;

import exchange.app.api.model.Direction;
import exchange.app.api.model.Pair;
import exchange.builders.CoreTicket;
import java.math.BigDecimal;
import org.junit.jupiter.api.Test;

public class OrderTicketTest {

  private final long epoch = System.currentTimeMillis();

  @Test
  public final void testTransactionTicket() {
    CoreTicket ticket = new CoreTicket(1L, 100_0000, 4_1000, epoch, 1L);
    assertEquals(100_0000, ticket.getValue());
    assertEquals(4_1000, ticket.getRatio());
    ticket = new CoreTicket(2L, 100_0000, 4_2000, epoch, 1L);
    assertEquals(100_0000, ticket.getValue());
    assertEquals(4_2000, ticket.getRatio());

  }


  @Test
  public final void roundingTest() {
    CoreTicket ticket = new CoreTicket(1L, 200_0001, 3_0001, epoch, 1L, Pair.EUR_PLN,
        Direction.SELL);
    assertEquals("valueAmount : '200.00' EUR ratio : '3.0001'", ticket.toString());
    assertEquals(new BigDecimal("200.00"), ticket.getFinancialValue());
    ticket = new CoreTicket(1L, 200_0099, 3_0001, epoch, 1L, Pair.EUR_PLN, Direction.SELL);
    assertEquals("valueAmount : '200.00' EUR ratio : '3.0001'", ticket.toString());
    assertEquals(new BigDecimal("200.00"), ticket.getFinancialValue());
  }


}
