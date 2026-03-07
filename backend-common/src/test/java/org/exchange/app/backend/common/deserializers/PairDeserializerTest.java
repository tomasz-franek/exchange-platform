package org.exchange.app.backend.common.deserializers;

import org.exchange.app.backend.common.exceptions.SerializationException;
import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;
import static org.junit.jupiter.api.Assertions.assertThrows;

class PairDeserializerTest {

  private final PairDeserializer deserializer = new PairDeserializer();

  @Test
  void deserialize_should_deserializeData_when_validInput() {

    for (byte b = 0; b < (byte) Pair.values().length; b++) {
      Pair result = deserializer.deserialize("", new byte[]{b});

      assertThat(result).isNotNull();
      assertThat(result).isEqualTo(Pair.values()[b]);
    }
  }

  @Test
  void deserialize_should_shouldReturnRuntimeException_when_inputBytesFromEmptyString() {
    String inputString = "";
    byte[] inputBytes = inputString.getBytes();

    SerializationException serializationException = assertThrows(SerializationException.class,
        () -> deserializer.deserialize(inputString, inputBytes));

    assertThat(serializationException.getExceptionRecord().getMessage()).isEqualTo(
        "SerializationException : Error deserializing Pair Index 0 out of bounds for length 0");

  }

  @Test
  void deserialize_should_shouldReturnNullPair_when_inputBytesIsNULL_BYTE() {
    String inputString = null;
    byte[] inputBytes = new byte[]{NULL_BYTE};

    assertThat(deserializer.deserialize(inputString, inputBytes)).isNull();
  }

  @Test
  void deserialize_should_shouldReturnNullPair_when_inputBytesIsNull() {
    String inputString = null;
    byte[] inputBytes = null;

    assertThat(deserializer.deserialize(inputString, inputBytes)).isNull();
  }

}
