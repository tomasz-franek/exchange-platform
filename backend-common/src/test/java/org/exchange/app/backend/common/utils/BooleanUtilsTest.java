package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class BooleanUtilsTest {

  private final BooleanUtils booleanUtils = new BooleanUtils();

  @ParameterizedTest
  @ValueSource(booleans = {
      true,
      false
  })
  public final void eventTypeToByteArray_should_returnCorrectEventType_when_parameterIsCorrectByteArray(
      Boolean value) {
    assertThat(
        booleanUtils.toObject(new ByteArrayData(booleanUtils.toByteArray(value, null))))
        .isEqualTo(value);
  }


  @Test
  public final void eventTypeToByteArray_should_returnNULL_BYTE_when_calledWithNullDirection() {
    assertThat(booleanUtils.toByteArray(null, null)).isEqualTo(new byte[]{NULL_BYTE});
  }

  @Test
  public final void byteArrayToEventType_should_nullEventType_when_calledWithNULL_BYTE() {
    assertThat(booleanUtils.toObject(new ByteArrayData(new byte[]{NULL_BYTE}))).isNull();
  }
}