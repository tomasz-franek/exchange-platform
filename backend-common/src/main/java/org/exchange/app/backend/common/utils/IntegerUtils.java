package org.exchange.app.backend.common.utils;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

public class IntegerUtils implements SerialisationUtils<Integer> {

  @Override
  public int getSize() {
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
  public Integer toObject(byte[] bytes) {
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
