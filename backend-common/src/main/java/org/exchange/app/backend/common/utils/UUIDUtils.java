package org.exchange.app.backend.common.utils;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import java.util.UUID;

public class UUIDUtils implements SerializationUtils<UUID> {

  public static int getSize() {
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
  public UUID toObject(ByteArrayData byteArrayData) {
    if (byteArrayData.bytes.length - byteArrayData.position < getSize()) {
      throw new IllegalArgumentException("Byte array must be 17 or more bytes long.");
    }
    if (byteArrayData.bytes[byteArrayData.position] == NULL_BYTE) {
      byteArrayData.position += getSize();
      return null;
    } else {
      byteArrayData.position++;
      long mostSignificantBits = ((long) byteArrayData.bytes[byteArrayData.position++] << 56) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF) << 48) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF) << 40) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF) << 32) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF) << 24) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF) << 16) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF) << 8) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF));
      long leastSignificantBits = ((long) byteArrayData.bytes[byteArrayData.position++] << 56) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF) << 48) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF) << 40) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF) << 32) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF) << 24) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF) << 16) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF) << 8) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF));
      return new UUID(mostSignificantBits, leastSignificantBits);
    }
  }
}
