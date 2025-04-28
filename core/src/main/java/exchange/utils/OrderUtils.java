package exchange.utils;

import exchange.builders.CoreTicket;
import jakarta.validation.constraints.NotNull;

public class OrderUtils {

  public static CoreTicket split(@NotNull CoreTicket orderTicketAfterExchange,
      final long valueToSubtract,
      final long epochUTC, long id) throws ArithmeticException {
    if (orderTicketAfterExchange.getValue() - valueToSubtract >= 0) {
      return new CoreTicket(id, valueToSubtract, orderTicketAfterExchange.getRatio(), epochUTC,
          orderTicketAfterExchange.getPair(), orderTicketAfterExchange.getDirection());
    } else {
      throw new ArithmeticException(
          String.format("Value to subtract %d is bigger than current value %d", valueToSubtract,
              orderTicketAfterExchange.getValue()));
    }
  }
}
