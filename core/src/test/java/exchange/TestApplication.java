package exchange;

import static exchange.app.api.model.Direction.BUY;
import static exchange.app.api.model.Direction.SELL;

import exchange.app.api.model.Direction;
import exchange.app.api.model.Pair;
import exchange.builders.CoreTicketBuilder;
import exchange.controllers.ExchangeController;
import exchange.data.ExchangeResult;
import exchange.exceptions.ExchangeException;
import java.security.SecureRandom;

public class TestApplication {

  private static final SecureRandom secureRandom = new SecureRandom();

  public static void main(String[] args) throws ExchangeException {
    long id = 1;

    ExchangeController exchangeController = new ExchangeController(Pair.EUR_PLN);
    ExchangeResult result;
    long prev;
    long curr = 0;
    long transactions = 0;
    long ratio;
    Direction direction;
    long value;
    while (true) {
      direction = getRandomDirection();
      if (exchangeController.getTotalTicketOrders(direction) > 3) {
        direction = direction.equals(SELL) ? BUY : SELL;
      }
      if (direction.equals(Direction.BUY)) {
        value = secureRandom.nextLong(10_0000, 50_0000);
        ratio = 101;
      } else {
        ratio = 100;
        value = secureRandom.nextLong(100_0000, 800_0000);
      }
      exchangeController.addCoreTicket(
          CoreTicketBuilder
              .createBuilder()
              .withId(id)
              .withPair(Pair.EUR_PLN)
              .withRatio(ratio)
              .withValueAmount(value)
              .withEpochUTC(System.currentTimeMillis())
              .withIdUser(1L)
              .withDirection(direction)
              .build());
      result = exchangeController.doExchange();
      if (result != null) {
        transactions++;
      }
      while (result != null) {
        result = exchangeController.doExchange();
        if (result != null) {
          transactions++;
        }
      }
      if (id % 1_000_000 == 0) {
        prev = curr;
        curr = System.currentTimeMillis();
        System.out.println(
            (curr - prev)
                + " "
                + transactions
                + " sell size : "
                + exchangeController.getTotalTicketOrders(Direction.SELL)
                + " buy size: "
                + exchangeController.getTotalTicketOrders(Direction.BUY));
        transactions = 0;
      }
      ++id;
    }
  }

  private static Direction getRandomDirection() {
    if (secureRandom.nextBoolean()) {
      return BUY;
    } else {
      return SELL;
    }
  }
}
