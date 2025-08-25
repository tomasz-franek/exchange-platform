package org.exchange.app.backend.common.utils;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import org.exchange.app.common.api.model.Direction;

public class DirectionUtils implements SerialisationUtils<Direction> {

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
  public Direction toObject(byte[] bytes) {
    if (bytes[0] == NULL_BYTE) {
      return null;
    }
    if (bytes.length != 1) {
      throw new IllegalArgumentException("Byte array must be exactly 1 byte.");
    }
    return (bytes[0] == 1) ? Direction.BUY : Direction.SELL;
  }
}
