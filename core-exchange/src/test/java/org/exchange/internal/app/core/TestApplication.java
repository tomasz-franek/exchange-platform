package org.exchange.internal.app.core;

import static org.exchange.app.common.api.model.Direction.BUY;
import static org.exchange.app.common.api.model.Direction.SELL;

import java.security.SecureRandom;
import java.util.Optional;
import java.util.UUID;
import org.exchange.app.backend.common.builders.CoreTicketBuilder;
import org.exchange.app.backend.common.builders.ExchangeResult;
import org.exchange.app.backend.common.exceptions.ExchangeException;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.exchange.internal.app.core.services.ExchangeService;
import org.exchange.internal.app.core.strategies.ratio.FirstTicketRatioStrategy;

public class TestApplication {

  private static final SecureRandom secureRandom = new SecureRandom();

  public static void main(String[] args) throws ExchangeException {
    long id = 1;

    ExchangeService exchangeService = new ExchangeService(
        Pair.EUR_PLN, new FirstTicketRatioStrategy());
    Optional<ExchangeResult> result;
    long prev;
    long curr = 0;
    long transactions = 0;
    long ratio;
    Direction direction;
    long value;
    while (true) {
      direction = getRandomDirection();
      if (exchangeService.getTotalTicketOrders(direction) > 3) {
        direction = direction.equals(SELL) ? BUY : SELL;
      }
      if (direction.equals(Direction.BUY)) {
        value = secureRandom.nextLong(10_0000, 50_0000);
        ratio = 101;
      } else {
        ratio = 100;
        value = secureRandom.nextLong(100_0000, 800_0000);
      }
      exchangeService.addCoreTicket(
          CoreTicketBuilder
              .createBuilder()
              .withId(id)
              .withPair(Pair.EUR_PLN)
              .withRatio(ratio)
              .withAmount(value)
              .withEpochUTC(ExchangeDateUtils.currentEpochUtc())
              .withUserId(UUID.randomUUID())
              .withDirection(direction)
              .build());
      result = exchangeService.doExchange();
      if (result.isPresent()) {
        transactions++;
      }
      while (result.isPresent()) {
        result = exchangeService.doExchange();
        if (result.isPresent()) {
          transactions++;
        }
      }
      if (id % 1_000_000 == 0) {
        prev = curr;
        curr = ExchangeDateUtils.currentEpochUtc();
        ;
        System.out.println(
            (curr - prev)
                + " "
                + transactions
                + " sell size : "
                + exchangeService.getTotalTicketOrders(Direction.SELL)
                + " buy size: "
                + exchangeService.getTotalTicketOrders(Direction.BUY));
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
