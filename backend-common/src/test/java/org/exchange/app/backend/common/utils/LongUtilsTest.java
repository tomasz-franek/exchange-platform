package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class LongUtilsTest {

  private final LongUtils longUtils = new LongUtils();
  @ParameterizedTest
  @ValueSource(longs = {
      Long.MAX_VALUE,
      Long.MIN_VALUE,
      Integer.MAX_VALUE,
      Integer.MIN_VALUE,
      Byte.MAX_VALUE,
      Byte.MIN_VALUE,
      Short.MAX_VALUE,
      Short.MIN_VALUE,
      0,
      100,
      -100,
      20000,
      -20000
  })
  void toObject_should_returnCorrectLong_when_parameterIsCorrectByteArray(Long value) {
    assertThat(longUtils.toObject(new ByteArrayData(longUtils.toByteArray(value, null)))).isEqualTo(
        value);
  }

  @Test
  public final void toByteArray_should_returnNULL_BYTE_when_calledWithNullLong() {
    assertThat(longUtils.toByteArray(null, null)).isEqualTo(
        new byte[]{NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE,
            NULL_BYTE, NULL_BYTE});
  }

  @Test
  public final void toObject_should_nullLong_when_calledWithNULL_BYTE() {
    assertThat(
        longUtils.toObject(
            new ByteArrayData(new byte[]{NULL_BYTE, 0, 0, 0, 0, 0, 0, 0, 0}))).isNull();
  }

  @Test
  public final void toObject_should_throwException_when_calledWithLengthLessThanNineBytes() {
    RuntimeException runtimeException = assertThrows(RuntimeException.class,
        () -> longUtils.toObject(new ByteArrayData(new byte[]{1, 2, 3, 4}))
    );

    assertThat(runtimeException.getMessage())
        .isEqualTo("Byte array must be 9 or more bytes long.");
  }

}