package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class IntegerUtilsTest {

  private final IntegerUtils integerUtils = new IntegerUtils();
  @ParameterizedTest
  @ValueSource(ints = {
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
  void integerToByteArray_should_returnCorrectInteger_when_parameterIsCorrectByteArray(
      Integer value) {
    assertThat(
        integerUtils.toObject(new ByteArrayData(integerUtils.toByteArray(value, null)))).isEqualTo(
        value);
  }

  @Test
  public final void integerToByteArray_should_returnNULL_BYTE_when_calledWithNullInteger() {
    assertThat(integerUtils.toByteArray(null, null)).isEqualTo(
        new byte[]{NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE});
  }

  @Test
  public final void byteArrayToInteger_should_nullInteger_when_calledWithNULL_BYTE() {
    assertThat(
        integerUtils.toObject(new ByteArrayData(new byte[]{NULL_BYTE, 0, 0, 0, 0}))).isNull();
  }

  @Test
  public final void byteArrayToInteger_should_throwException_when_calledWithLengthLessThanFiveBytes() {
    RuntimeException runtimeException = assertThrows(RuntimeException.class,
        () -> integerUtils.toObject(new ByteArrayData(new byte[]{1, 2, 3, 4}))
    );

    assertThat(runtimeException.getMessage())
        .isEqualTo("Byte array must be 5 bytes or more long.");
  }

}