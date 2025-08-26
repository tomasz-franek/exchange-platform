package org.exchange.app.backend.common.utils;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import org.exchange.app.common.api.model.Direction;

public class DirectionUtils implements SerializationUtils<Direction> {

  @Override
  public int getSize() {
    return 1;
  }

  @Override
  public byte[] toByteArray(Direction direction, ByteArrayData data) {
    byte[] current;
    if (direction == null) {
      current = new byte[]{NULL_BYTE};
    } else {
      current = new byte[]{(direction.equals(Direction.BUY)) ? (byte) 1 : (byte) 0};
    }
    if (data != null) {
      System.arraycopy(current, 0, data.bytes, data.position, getSize());
      data.position += getSize();
    }
    return current;

  }

  @Override
  public Direction toObject(ByteArrayData data) {
    if (data.bytes[data.position] == NULL_BYTE) {
      data.position += getSize();
      return null;
    }
    if (data.bytes.length - data.position < getSize()) {
      throw new IllegalArgumentException("Byte array must be exactly 1 byte.");
    }
    return (data.bytes[data.position++] == 1) ? Direction.BUY : Direction.SELL;
  }
}
