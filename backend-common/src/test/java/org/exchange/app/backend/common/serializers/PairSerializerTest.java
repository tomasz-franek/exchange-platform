package org.exchange.app.backend.common.serializers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;

class PairSerializerTest {

  @Test
  void serialize_should_returnCorrectByteArray_when_dataIsPairObject() {
    try (PairSerializer serializer = new PairSerializer()) {
      byte position = 0;
      for (Pair pair : Pair.values()) {
        assertThat(serializer.serialize("", pair))
            .isEqualTo(new byte[]{position});
        position++;
      }
    }
  }

  @Test
  void serialize_should_returnError_when_dataIsNull() {
    try (PairSerializer serializer = new PairSerializer()) {
      Exception exception = assertThrows(IllegalStateException.class,
          () -> serializer.serialize("", null));

      String expectedMessage = "Can't serialize object Pair: null";
      String actualMessage = exception.getMessage();

      assertThat(actualMessage).isEqualTo(expectedMessage);
    }
  }
}