package org.exchange.app.backend.common.utils;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

public class IntegerUtils implements SerializationUtils<Integer> {

  public static int getSize() {
    return 5;
  }

  @Override
  public byte[] toByteArray(Integer integerValue, ByteArrayData data) {
    byte[] current;
    if (integerValue == null) {
      current = new byte[]{NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE, NULL_BYTE};
    } else {
      int value = integerValue;
      current = new byte[]{
          (byte) 1,
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
  public Integer toObject(ByteArrayData data) {
    if (data.bytes.length - data.position < getSize()) {
      throw new IllegalArgumentException("Byte array must be 5 bytes or more long.");
    }
    if (data.bytes[data.position] == NULL_BYTE) {
      data.position += getSize();
      return null;
    } else {
      data.position++;
      return ((int) data.bytes[data.position++] << 24) |
          ((data.bytes[data.position++] & 0xFF) << 16) |
          ((data.bytes[data.position++] & 0xFF) << 8) |
          (data.bytes[data.position++] & 0xFF);
    }
  }
}
