package org.exchange.app.backend.common.deserializers;

import org.exchange.app.backend.common.ObjectUtilsTest;
import org.exchange.app.backend.common.builders.ExchangeResult;
import org.exchange.app.backend.common.exceptions.SerializationException;
import org.exchange.app.backend.common.serializers.ExchangeResultSerializer;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class ExchangeResultDeserializerTest {

  private final ExchangeResultDeserializer deserializer = new ExchangeResultDeserializer();
  private final ExchangeResultSerializer serializer = new ExchangeResultSerializer();

  @Test
  void deserializeCompact_should_deserializeByteArray_when_correctExchangeResult() {
    for (int i = 0; i < 100; i++) {
      ExchangeResult exchangeResult = ObjectUtilsTest.generateRandomExchangeResult();

      ExchangeResult processedExchangeResult = deserializer.deserializeCompact(
          serializer.serializeCompact(exchangeResult));

      ObjectUtilsTest.validateExchangeResult(processedExchangeResult, exchangeResult);
    }
  }

  @Test
  void deserializeStandard_should_deserializeByteArray_when_correctExchangeResult() {
    for (int i = 0; i < 100; i++) {
      ExchangeResult exchangeResult = ObjectUtilsTest.generateRandomExchangeResult();

      ExchangeResult processedExchangeResult = deserializer.deserializeStandard(
          serializer.serializeStandard(exchangeResult));

      ObjectUtilsTest.validateExchangeResult(processedExchangeResult, exchangeResult);
    }
  }

  @Test
  void deserializeStandard_should_deserializeToTheSameObject_when_ExchangeResultAllFieldsNulls() {
    ExchangeResult exchangeResult = new ExchangeResult();

    ExchangeResult processedExchangeResult = deserializer.deserializeStandard(
        serializer.serializeStandard(exchangeResult));

    ObjectUtilsTest.validateExchangeResult(processedExchangeResult, exchangeResult);
  }

  @Test
  void deserializeCompact_should_deserializeToTheSameObject_when_ExchangeResultAllFieldsNulls() {
    ExchangeResult exchangeResult = new ExchangeResult();

    ExchangeResult processedExchangeResult = deserializer.deserializeCompact(
        serializer.serializeCompact(exchangeResult));

    ObjectUtilsTest.validateExchangeResult(processedExchangeResult, exchangeResult);
  }

  @Test
  void deserializeCompact_should_deserializeToTheSameObject_when_ExchangeResultNull() {
    ExchangeResult exchangeResult = null;

    ExchangeResult processedExchangeResult = deserializer.deserializeCompact(
        serializer.serializeCompact(exchangeResult));

    assertThat(processedExchangeResult).isNull();
  }

  @Test
  void deserializeCompact_should_returnNull_when_byteArrayNull() {

    SerializationException exception = assertThrows(SerializationException.class,
        () -> deserializer.deserializeCompact(null));

    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo(
        "SerializationException : Error deserializing ExchangeResult");
  }

  @Test
  void deserializeCompact_should_returnException_when_byteArrayEmpty() {

    SerializationException exception = assertThrows(SerializationException.class,
        () -> deserializer.deserializeCompact(new byte[0]));

    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo(
        "SerializationException : Error deserializing ExchangeResult");
  }

  @Test
  void deserializeCompact_should_returnException_when_byteArrayTooSmall() {

    SerializationException exception = assertThrows(SerializationException.class,
        () -> deserializer.deserializeCompact(new byte[]{1}));

    assertThat(exception.getExceptionRecord().getMessage()).isEqualTo(
        "SerializationException : Error deserializing ExchangeResult");
  }


}