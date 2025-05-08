package exchange.builders;

import static exchange.app.common.api.model.Direction.SELL;
import static exchange.app.common.api.model.Pair.EUR_PLN;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

class CoreTicketTest {

  @Test
  public final void newValue_should_generateException_when_newValueToBiggerThanValueOfTheTicket() {
    Throwable exception = assertThrows(ArithmeticException.class, () -> {
      CoreTicket ticket = new CoreTicket(1L, 20_0000, 3_0000, 1, 1L, EUR_PLN, SELL);
      ticket.newValue(21_0000, 1, 1L);
    });
    assertThat(exception.getMessage()).isEqualTo(
        "Value 210000 is bigger than current value 200000");
  }

  @Test
  public final void newValue_should_returnNewTicketWithNewValue_when_methodIsCalled() {
    CoreTicket ticket = new CoreTicket(1L, 200_0000, 3_0000, 1, 1L, EUR_PLN, SELL);
    long newValue = 50_0000;
    long newEpoch = 2;
    CoreTicket ticketAfterSplit = ticket.newValue(newValue, newEpoch, 1L);
    assertThat(ticketAfterSplit).isNotNull();
    assertThat(ticketAfterSplit.getValue()).isEqualTo(newValue);
    assertThat(ticketAfterSplit.getEpochUTC()).isEqualTo(newEpoch);
  }
}