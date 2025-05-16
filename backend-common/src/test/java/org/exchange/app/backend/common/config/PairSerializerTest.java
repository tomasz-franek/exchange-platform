package org.exchange.app.backend.common.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.nio.charset.Charset;
import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;

class PairSerializerTest {

  @Test
  void serialize_should_returnCorrectByteArray_when_dataIsPairObject() {
    try (PairSerializer serializer = new PairSerializer()) {
      assertThat(serializer.serialize("", Pair.EUR_CHF))
          .isEqualTo(Pair.EUR_CHF.toString().getBytes(Charset.defaultCharset()));
    }
  }

  @Test()
  void serialize_should_returnError_when_dataIsNotPairType() {
    try (PairSerializer serializer = new PairSerializer()) {
      Exception exception = assertThrows(IllegalStateException.class, () -> {
        serializer.serialize("", "EUR_GBP");
      });

      String expectedMessage = "Can't serialize object: EUR_GBP";
      String actualMessage = exception.getMessage();

      assertThat(actualMessage).isEqualTo(expectedMessage);
      ;
    }
  }

  @Test()
  void serialize_should_returnError_when_dataIsNull() {
    try (PairSerializer serializer = new PairSerializer()) {
      Exception exception = assertThrows(IllegalStateException.class, () -> {
        serializer.serialize("", null);
      });

      String expectedMessage = "Can't serialize object: null";
      String actualMessage = exception.getMessage();

      assertThat(actualMessage).isEqualTo(expectedMessage);
      ;
    }
  }
}