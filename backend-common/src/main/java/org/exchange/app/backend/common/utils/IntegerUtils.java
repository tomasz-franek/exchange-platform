package org.exchange.app.backend.common.utils;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

public class IntegerUtils {

  public static byte[] integerToByteArray(Integer integerValue) {
    if (integerValue == null) {
      return new byte[]{NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE};
    }
    int value = integerValue;
    return new byte[]{
        (byte) 1,
        (byte) (value >> 24),
        (byte) (value >> 16),
        (byte) (value >> 8),
        (byte) value
    };
  }

  public static Integer byteArrayToInteger(byte[] bytes) {
    if (bytes.length != 5) {
      throw new IllegalArgumentException("Byte array must be exactly 5 bytes long.");
    }
    if (bytes[0] == NULL_BYTE) {
      return null;
    }
    return ((int) bytes[1] << 24) |
        ((bytes[2] & 0xFF) << 16) |
        ((bytes[3] & 0xFF) << 8) |
        (bytes[4] & 0xFF);
  }
}
