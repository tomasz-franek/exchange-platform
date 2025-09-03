package org.exchange.app.backend.common.serializers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import org.exchange.app.backend.common.ObjectUtilsTest;
import org.exchange.app.backend.common.builders.ExchangeResult;
import org.junit.jupiter.api.Test;

public class ExchangeResultSerializerTest {

  @Test
  void serializeStandard_should_returnCorrectByteArray_when_dataIsExchangeResult() {
    try (ExchangeResultSerializer serializer = new ExchangeResultSerializer()) {
      byte[] array = serializer.serializeStandard(ObjectUtilsTest.generateRandomExchangeResult());
      assertThat(array.length).isGreaterThan(2000);
    }
  }

  @Test
  void serializeCompact_should_returnCorrectByteArray_when_dataIsExchangeResult() {
    try (ExchangeResultSerializer serializer = new ExchangeResultSerializer()) {
      byte[] array = serializer.serializeCompact(ObjectUtilsTest.generateRandomExchangeResult());
      assertThat(array.length).isEqualTo(409);
    }
  }

  @Test
  void serializeStandard_should_returnNULL_BYTE_when_exchangeResultIsNull() {
    try (ExchangeResultSerializer serializer = new ExchangeResultSerializer()) {
      byte[] bytes = serializer.serializeStandard(null);

      assertThat(bytes.length).isEqualTo(4);
      assertThat(bytes).isEqualTo(new byte[]{110, 117, 108, 108});
    }
  }

  @Test
  void serializeCompact_should_returnNULL_BYTE_when_ExchangeResultIsNull() {
    try (ExchangeResultSerializer serializer = new ExchangeResultSerializer()) {
      byte[] bytes = serializer.serializeCompact(null);

      assertThat(bytes.length).isEqualTo(ExchangeResultSerializer.getSize());
      assertThat(bytes[0]).isEqualTo(NULL_BYTE);
    }
  }

  @Test
  void serializeStandard_should_returnNULL_BYTE_when_ExchangeResultWithEmptyFields() {
    try (ExchangeResultSerializer serializer = new ExchangeResultSerializer()) {
      byte[] bytes = serializer.serializeStandard(new ExchangeResult());

      assertThat(bytes.length).isEqualTo(207);
    }
  }

  @Test
  void serializeCompact_should_returnCorrectLength_when_ExchangeResultWithEmptyFields() {
    try (ExchangeResultSerializer serializer = new ExchangeResultSerializer()) {
      byte[] bytes = serializer.serializeCompact(new ExchangeResult());

      assertThat(bytes.length).isEqualTo(ExchangeResultSerializer.getSize());
      assertThat(bytes[0]).isEqualTo((byte) 1);
    }
  }
}
