package org.exchange.app.backend.common.utils;

import jakarta.annotation.Nullable;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

public class BooleanUtils implements SerializationUtils<Boolean> {

  public static int getSize() {
    return ONE;
  }

  @Override
  public byte[] toByteArray(Boolean booleanValue, ByteArrayData data) {
    byte[] current;
    if (booleanValue == null) {
      current = new byte[]{NULL_BYTE};
    } else {
      current = new byte[]{(byte) (booleanValue ? 1 : 0)};
    }
    if (data != null) {
      System.arraycopy(current, 0, data.bytes, data.position, getSize());
      data.position += getSize();
    }
    return current;
  }

  @Override
  @Nullable
  public Boolean toObject(ByteArrayData byteArrayData) {
    if (byteArrayData.bytes.length - byteArrayData.position < getSize()) {
      throw new IllegalArgumentException("Byte array must be 1 or more bytes long.");
    }
    if (byteArrayData.bytes[byteArrayData.position] == NULL_BYTE) {
      byteArrayData.position += getSize();
      return null;
    } else {
      return byteArrayData.bytes[byteArrayData.position++] == 1;
    }
  }
}
