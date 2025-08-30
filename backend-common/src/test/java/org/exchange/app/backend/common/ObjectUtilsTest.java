package org.exchange.app.backend.common;

import static org.assertj.core.api.Assertions.assertThat;

import java.security.SecureRandom;
import java.util.UUID;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.builders.ExchangeResult;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;

public class ObjectUtilsTest {

  public static void validateCoreTicket(CoreTicket result, CoreTicket source) {
    if (result == null && source == null) {
      return;
    }
    assertThat(result).isNotNull();
    assertThat(source.getId()).isEqualTo(result.getId());
    assertThat(source.getAmount()).isEqualTo(result.getAmount());
    assertThat(source.getRatio()).isEqualTo(result.getRatio());
    assertThat(source.getUserId()).isEqualTo(result.getUserId());
    assertThat(source.getPair()).isEqualTo(result.getPair());
    assertThat(source.getDirection()).isEqualTo(result.getDirection());
    assertThat(source.getEpochUtc()).isEqualTo(result.getEpochUtc());
  }

  public static void validateExchangeResult(ExchangeResult result, ExchangeResult source) {
    assertThat(result).isNotNull();
    validateCoreTicket(source.getBuyTicket(), result.getBuyTicket());
    validateCoreTicket(source.getSellTicket(), result.getSellTicket());
    validateCoreTicket(source.getBuyExchange(), result.getBuyExchange());
    validateCoreTicket(source.getSellExchange(), result.getSellExchange());
    validateCoreTicket(source.getBuyTicketAfterExchange(), result.getBuyTicketAfterExchange());
    validateCoreTicket(source.getSellTicketAfterExchange(), result.getSellTicketAfterExchange());
    validateCoreTicket(source.getCancelledTicket(), result.getCancelledTicket());

    assertThat(source.getExchangeEpochUTC()).isEqualTo(result.getExchangeEpochUTC());
  }

  public static CoreTicket generateRandomCoreTicket() {
    SecureRandom random = new SecureRandom(UUID.randomUUID().toString().getBytes());
    CoreTicket coreTicket = new CoreTicket();
    coreTicket.setId(random.nextLong());
    coreTicket.setAmount(random.nextLong());
    coreTicket.setRatio(random.nextLong());
    coreTicket.setUserId(UUID.randomUUID());
    coreTicket.setPair(Pair.values()[random.nextInt(Pair.values().length)]);
    coreTicket.setEpochUtc(random.nextLong());
    coreTicket.setDirection(Direction.values()[random.nextInt(Direction.values().length)]);
    return coreTicket;
  }

  public static ExchangeResult generateRandomExchangeResult() {
    ExchangeResult exchangeResult = new ExchangeResult();
    exchangeResult.setBuyTicket(ObjectUtilsTest.generateRandomCoreTicket());
    exchangeResult.setSellTicket(ObjectUtilsTest.generateRandomCoreTicket());
    exchangeResult.setBuyExchange(ObjectUtilsTest.generateRandomCoreTicket());
    exchangeResult.setSellExchange(ObjectUtilsTest.generateRandomCoreTicket());
    exchangeResult.setBuyTicketAfterExchange(ObjectUtilsTest.generateRandomCoreTicket());
    exchangeResult.setSellTicketAfterExchange(ObjectUtilsTest.generateRandomCoreTicket());
    exchangeResult.setCancelledTicket(ObjectUtilsTest.generateRandomCoreTicket());
    exchangeResult.setExchangeEpochUTC(ExchangeDateUtils.currentLocalDateTime());
    return exchangeResult;
  }
}
