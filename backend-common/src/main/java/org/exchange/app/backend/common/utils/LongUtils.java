package org.exchange.app.backend.common.utils;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

public class LongUtils implements SerializationUtils<Long> {

  @Override
  public int getSize() {
    return 9;
  }

  @Override
  public byte[] toByteArray(Long longValue, ByteArrayData data) {
    byte[] current;
    if (longValue == null) {
      current = new byte[]{NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE,
          NULL_BYTE,
          NULL_BYTE, NULL_BYTE};
    } else {
      long value = longValue;
      current = new byte[]{
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
    if (data != null) {
      System.arraycopy(current, 0, data.bytes, data.position, getSize());
      data.position += getSize();
    }
    return current;
  }

  @Override
  public Long toObject(ByteArrayData byteArrayData) {
    if (byteArrayData.bytes.length - byteArrayData.position < getSize()) {
      throw new IllegalArgumentException("Byte array must be 9 or more bytes long.");
    }
    if (byteArrayData.bytes[byteArrayData.position] == NULL_BYTE) {
      byteArrayData.position += getSize();
      return null;
    } else {
      byteArrayData.position++;
      return ((long) byteArrayData.bytes[byteArrayData.position++] << 56) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF) << 48) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF) << 40) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF) << 32) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF) << 24) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF) << 16) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF) << 8) |
          ((long) (byteArrayData.bytes[byteArrayData.position++] & 0xFF));
    }
  }
}
