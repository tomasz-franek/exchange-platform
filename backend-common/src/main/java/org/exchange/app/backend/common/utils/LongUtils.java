package org.exchange.app.backend.common.utils;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

public class LongUtils {

  public static byte[] longToByteArray(Long longValue) {
    if (longValue == null) {
      return new byte[]{NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE,
          NULL_BYTE, NULL_BYTE};
    }
    long value = longValue;
    return new byte[]{
        (byte) 1,
        (byte) (value >> 56),
        (byte) (value >> 48),
        (byte) (value >> 40),
        (byte) (value >> 32),
        (byte) (value >> 24),
        (byte) (value >> 16),
        (byte) (value >> 8),
        (byte) value
    };
  }

  public static Long byteArrayToLong(byte[] bytes) {
    if (bytes.length != 9) {
      throw new IllegalArgumentException("Byte array must be exactly 9 bytes long.");
    }
    if (bytes[0] == NULL_BYTE) {
      return null;
    }
    return ((long) bytes[1] << 56) |
        ((long) (bytes[2] & 0xFF) << 48) |
        ((long) (bytes[3] & 0xFF) << 40) |
        ((long) (bytes[4] & 0xFF) << 32) |
        ((long) (bytes[5] & 0xFF) << 24) |
        ((long) (bytes[6] & 0xFF) << 16) |
        ((long) (bytes[7] & 0xFF) << 8) |
        ((long) (bytes[8] & 0xFF));
  }
}
