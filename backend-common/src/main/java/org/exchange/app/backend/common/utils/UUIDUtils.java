package org.exchange.app.backend.common.utils;

import java.util.UUID;

public class UUIDUtils {

  public static byte[] uuidToByteArray(UUID uuid) {
    long mostSignificantBits = uuid.getMostSignificantBits();
    long leastSignificantBits = uuid.getLeastSignificantBits();
    return new byte[]{
        (byte) (mostSignificantBits >> 56),
        (byte) (mostSignificantBits >> 48),
        (byte) (mostSignificantBits >> 40),
        (byte) (mostSignificantBits >> 32),
        (byte) (mostSignificantBits >> 24),
        (byte) (mostSignificantBits >> 16),
        (byte) (mostSignificantBits >> 8),
        (byte) mostSignificantBits,
        (byte) (leastSignificantBits >> 56),
        (byte) (leastSignificantBits >> 48),
        (byte) (leastSignificantBits >> 40),
        (byte) (leastSignificantBits >> 32),
        (byte) (leastSignificantBits >> 24),
        (byte) (leastSignificantBits >> 16),
        (byte) (leastSignificantBits >> 8),
        (byte) leastSignificantBits
    };
  }

  public static UUID byteArrayToUUID(byte[] bytes) {
    if (bytes.length != 16) {
      throw new IllegalArgumentException("Byte array must be exactly 8 bytes long.");
    }
    long mostSignificantBits = ((long) bytes[0] << 56) |
        ((long) (bytes[1] & 0xFF) << 48) |
        ((long) (bytes[2] & 0xFF) << 40) |
        ((long) (bytes[3] & 0xFF) << 32) |
        ((long) (bytes[4] & 0xFF) << 24) |
        ((long) (bytes[5] & 0xFF) << 16) |
        ((long) (bytes[6] & 0xFF) << 8) |
        ((long) (bytes[7] & 0xFF));
    long leastSignificantBits = ((long) bytes[8] << 56) |
        ((long) (bytes[9] & 0xFF) << 48) |
        ((long) (bytes[10] & 0xFF) << 40) |
        ((long) (bytes[11] & 0xFF) << 32) |
        ((long) (bytes[12] & 0xFF) << 24) |
        ((long) (bytes[13] & 0xFF) << 16) |
        ((long) (bytes[14] & 0xFF) << 8) |
        ((long) (bytes[15] & 0xFF));
    return new UUID(mostSignificantBits, leastSignificantBits);
  }
}
