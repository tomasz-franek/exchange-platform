package org.exchange.app.backend.common.utils;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class LongUtilsTest {

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
  void longToByteArray(Long value) {
    assertThat(LongUtils.byteArrayToLong(LongUtils.longToByteArray(value))).isEqualTo(
        value);
  }

}