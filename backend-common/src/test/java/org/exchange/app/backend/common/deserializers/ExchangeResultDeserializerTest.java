package org.exchange.app.backend.common.deserializers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.exchange.app.backend.common.ObjectCompareTest;
import org.exchange.app.backend.common.builders.ExchangeResult;
import org.exchange.app.backend.common.serializers.ExchangeResultSerializer;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.junit.jupiter.api.Test;

class ExchangeResultDeserializerTest {

  private final ExchangeResultDeserializer deserializer = new ExchangeResultDeserializer();
  private final ExchangeResultSerializer serializer = new ExchangeResultSerializer();

  @Test
  void deserializeCompact_should_deserializeByteArray_when_correctExchangeResult() {
    for (int i = 0; i < 10000; i++) {
      ExchangeResult exchangeResult = generateRandomExchangeResult();

      ExchangeResult processedExchangeResult = deserializer.deserializeCompact(
          serializer.serializeCompact(exchangeResult));

      ObjectCompareTest.validateExchangeResult(processedExchangeResult, exchangeResult);
    }
  }

  @Test
  void deserializeCompact_should_returnNull_when_byteArrayNull() {

    RuntimeException exception = assertThrows(RuntimeException.class,
        () -> deserializer.deserializeCompact(null));

    assertThat(exception.getMessage()).isEqualTo(
        "Error deserializing ExchangeResult");
  }

  @Test
  void deserializeCompact_should_returnException_when_byteArrayEmpty() {

    RuntimeException exception = assertThrows(RuntimeException.class,
        () -> deserializer.deserializeCompact(new byte[0]));

    assertThat(exception.getMessage()).isEqualTo(
        "Error deserializing ExchangeResult");
  }

  @Test
  void deserializeCompact_should_returnException_when_byteArrayTooSmall() {

    RuntimeException exception = assertThrows(RuntimeException.class,
        () -> deserializer.deserializeCompact(new byte[]{1}));

    assertThat(exception.getMessage()).isEqualTo(
        "Error deserializing ExchangeResult");
  }


  public static ExchangeResult generateRandomExchangeResult() {
    ExchangeResult exchangeResult = new ExchangeResult();
    exchangeResult.setBuyTicket(ObjectCompareTest.generateRandomCoreTicket());
    exchangeResult.setSellTicket(ObjectCompareTest.generateRandomCoreTicket());
    exchangeResult.setBuyExchange(ObjectCompareTest.generateRandomCoreTicket());
    exchangeResult.setSellExchange(ObjectCompareTest.generateRandomCoreTicket());
    exchangeResult.setBuyTicketAfterExchange(ObjectCompareTest.generateRandomCoreTicket());
    exchangeResult.setSellTicketAfterExchange(ObjectCompareTest.generateRandomCoreTicket());
    exchangeResult.setCancelledTicket(ObjectCompareTest.generateRandomCoreTicket());
    exchangeResult.setExchangeEpochUTC(ExchangeDateUtils.currentLocalDateTime());
    return exchangeResult;
  }
}