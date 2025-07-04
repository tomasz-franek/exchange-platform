package org.exchange.app.backend.common.utils;

public class LongUtils {

  public static byte[] longToByteArray(long value) {
    return new byte[]{
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

  public static long byteArrayToLong(byte[] bytes) {
    if (bytes.length != 8) {
      throw new IllegalArgumentException("Byte array must be exactly 8 bytes long.");
    }
    return ((long) bytes[0] << 56) |
        ((long) (bytes[1] & 0xFF) << 48) |
        ((long) (bytes[2] & 0xFF) << 40) |
        ((long) (bytes[3] & 0xFF) << 32) |
        ((long) (bytes[4] & 0xFF) << 24) |
        ((long) (bytes[5] & 0xFF) << 16) |
        ((long) (bytes[6] & 0xFF) << 8) |
        ((long) (bytes[7] & 0xFF));
  }
}
