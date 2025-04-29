package exchange;

import exchange.app.api.model.Direction;
import exchange.app.api.model.Pair;
import exchange.builders.CoreTicketBuilder;
import exchange.controllers.ExchangeController;
import exchange.data.ExchangeResult;
import exchange.exceptions.ExchangeException;
import java.security.SecureRandom;

public class TestApplication {

  private static SecureRandom secureRandom = new SecureRandom();

  public static void main(String[] args) throws ExchangeException {
    long id = 0;

    ExchangeController exchangeController = new ExchangeController(Pair.EUR_PLN);
    ExchangeResult result;
    long prev = 0;
    long curr = 0;
    long transactions = 0;
    long buy = 0;
    long sell = 0;
    Direction direction;
    while (true) {
      direction = getRandomDirection();
      if (direction.equals(Direction.BUY)) {
        buy++;
      } else {
        sell++;
      }
      exchangeController.addCoreTicket(
          CoreTicketBuilder
              .createBuilder()
              .withId(id)
              .withPair(Pair.EUR_PLN)
              .withRatio(secureRandom.nextLong(100, 110))
              .withValueAmount(secureRandom.nextLong(100, 1000000))
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
      if (id % 100000 == 0) {
        prev = curr;
        curr = System.currentTimeMillis();
        System.out.println(
            (curr - prev)
                + " "
                + transactions
                + " sell size : "
                + exchangeController.getTotalTicketOrders(Direction.SELL)
                + " buy size: "
                + exchangeController.getTotalTicketOrders(Direction.BUY)
                + " op buy: "
                + buy
                + " op sell: "
                + sell);
        transactions = 0;
      }
      ++id;
    }
  }

  private static Direction getRandomDirection() {

    if (secureRandom.nextBoolean()) {
      return Direction.BUY;
    } else {
      return Direction.SELL;
    }
  }
}
