package org.exchange.app.backend.common.utils;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import java.util.UUID;

public class UUIDUtils implements SerialisationUtils<UUID> {

  @Override
  public int getSize() {
    return 17;
  }

  @Override
  public byte[] toByteArray(UUID uuid, ByteArrayData data) {
    byte[] current;
    if (uuid == null) {
      current = new byte[]{NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE,
          NULL_BYTE,
          NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE,
          NULL_BYTE,
          NULL_BYTE};
    } else {
      long mostSignificantBits = uuid.getMostSignificantBits();
      long leastSignificantBits = uuid.getLeastSignificantBits();
      current = new byte[]{
          (byte) 1,
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
    if (data != null) {
      System.arraycopy(current, 0, data.bytes, data.position, getSize());
      data.position += getSize();
    }
    return current;
  }

  @Override
  public UUID toObject(byte[] bytes) {
    if (bytes.length != 17) {
      throw new IllegalArgumentException("Byte array must be exactly 17 bytes long.");
    }
    if (bytes[0] == NULL_BYTE) {
      return null;
    }
    long mostSignificantBits = ((long) bytes[1] << 56) |
        ((long) (bytes[2] & 0xFF) << 48) |
        ((long) (bytes[3] & 0xFF) << 40) |
        ((long) (bytes[4] & 0xFF) << 32) |
        ((long) (bytes[5] & 0xFF) << 24) |
        ((long) (bytes[6] & 0xFF) << 16) |
        ((long) (bytes[7] & 0xFF) << 8) |
        ((long) (bytes[8] & 0xFF));
    long leastSignificantBits = ((long) bytes[9] << 56) |
        ((long) (bytes[10] & 0xFF) << 48) |
        ((long) (bytes[11] & 0xFF) << 40) |
        ((long) (bytes[12] & 0xFF) << 32) |
        ((long) (bytes[13] & 0xFF) << 24) |
        ((long) (bytes[14] & 0xFF) << 16) |
        ((long) (bytes[15] & 0xFF) << 8) |
        ((long) (bytes[16] & 0xFF));
    return new UUID(mostSignificantBits, leastSignificantBits);
  }
}
