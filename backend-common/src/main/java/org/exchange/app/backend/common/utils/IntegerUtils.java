package org.exchange.app.backend.common.utils;

public class IntegerUtils {

  public static byte[] integerToByteArray(int value) {
    return new byte[]{
        (byte) (value >> 24),
        (byte) (value >> 16),
        (byte) (value >> 8),
        (byte) value
    };
  }

  public static int byteArrayToInteger(byte[] bytes) {
    if (bytes.length != 4) {
      throw new IllegalArgumentException("Byte array must be exactly 4 bytes long.");
    }
    return ((int) bytes[0] << 24) |
        ((bytes[1] & 0xFF) << 16) |
        ((bytes[2] & 0xFF) << 8) |
        (bytes[3] & 0xFF);
  }
}
