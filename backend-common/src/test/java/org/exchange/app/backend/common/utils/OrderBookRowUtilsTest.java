package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.exchange.app.common.api.model.OrderBookRow;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class OrderBookRowUtilsTest {

  private final OrderBookRowUtils orderBookRowUtils = new OrderBookRowUtils();

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
  void toByteArray_should_returnCorrectObject_when_parameterIsCorrectByteArray(Long value) {
    OrderBookRow row = orderBookRowUtils.toObject(new ByteArrayData(
        orderBookRowUtils.toByteArray(new OrderBookRow(value, value), null)));
    assertThat(row.getA()).isEqualTo(value);
    assertThat(row.getR()).isEqualTo(value);
  }

  @Test
  public final void toByteArray_should_returnNULL_BYTE_when_calledWithNullOrderBookRow() {
    assertThat(orderBookRowUtils.toByteArray(null, null)).isEqualTo(
        new byte[]{NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE,
            NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE,
            NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE});
  }

  @Test
  public final void toObject_should_nullLong_when_calledWithNULL_BYTE() {
    OrderBookRow row = orderBookRowUtils.toObject(
        new ByteArrayData(
            new byte[]{NULL_BYTE, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0}));
    assertThat(row).isNull();
  }

  @Test
  public final void toObject_should_nullFieldValues_when_calledWithNULL_BYTEField() {
    OrderBookRow row = orderBookRowUtils.toObject(
        new ByteArrayData(
            new byte[]{1, NULL_BYTE, 0, 0, 0, 0, 0, 0, 0, 0, NULL_BYTE, 0, 0, 0, 0, 0, 0, 0, 0}));
    assertThat(row.getA()).isNull();
    assertThat(row.getR()).isNull();
  }

  @Test
  public final void toObject_should_throwException_when_calledWithLengthLessThan19Bytes() {
    RuntimeException runtimeException = assertThrows(RuntimeException.class,
        () -> orderBookRowUtils.toObject(new ByteArrayData(
            new byte[]{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18}))
    );

    assertThat(runtimeException.getMessage())
        .isEqualTo("Byte array must be 19 or more bytes long.");
  }
}