package org.exchange.app.backend.common.serializers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

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
  void serialize_should_returnNULL_BYTE_when_pairIsNull() {
    try (PairSerializer serializer = new PairSerializer()) {
      byte[] serializedPair = serializer.serialize("", null);

      assertThat(serializedPair.length).isEqualTo(1);
      assertThat(serializedPair[0]).isEqualTo(NULL_BYTE);
    }
  }
}