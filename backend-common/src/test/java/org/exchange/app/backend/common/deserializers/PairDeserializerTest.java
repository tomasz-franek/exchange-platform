package org.exchange.app.backend.common.deserializers;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.exchange.app.common.api.model.Pair;
import org.junit.jupiter.api.Test;

public class PairDeserializerTest {

  private final PairDeserializer deserializer = new PairDeserializer();

  @Test
  public void deserialize_should_deserializeData_when_validInput() {

    for (byte b = 0; b < (byte) Pair.values().length; b++) {
      Pair result = deserializer.deserialize("", new byte[]{b});

      assertNotNull(result);
      assertThat(result).isEqualTo(Pair.values()[b]);
    }
  }

  @Test
  public void deserialize_should_shouldReturnRuntimeException_when_inputBytesFromEmptyString() {
    String inputString = "";
    byte[] inputBytes = inputString.getBytes();

    RuntimeException runtimeException = assertThrows(RuntimeException.class,
        () -> deserializer.deserialize(inputString, inputBytes));

    assertThat(runtimeException.getMessage()).isEqualTo("Error deserializing Pair");

  }

  @Test
  public void deserialize_should_shouldReturnRuntimeException_when_inputBytesNull() {
    String inputString = null;
    byte[] inputBytes = null;

    RuntimeException thrown = assertThrows(RuntimeException.class,
        () -> deserializer.deserialize(inputString, inputBytes));
    assertEquals("Error deserializing Pair", thrown.getMessage());
  }

}
