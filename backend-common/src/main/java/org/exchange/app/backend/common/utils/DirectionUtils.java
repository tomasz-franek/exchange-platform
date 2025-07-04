package org.exchange.app.backend.common.utils;

import org.exchange.app.common.api.model.Direction;

public class DirectionUtils {

  public static byte[] directionToByteArray(Direction direction) {
    return new byte[]{(direction.equals(Direction.BUY)) ? (byte) 1 : (byte) 0};
  }

  public static Direction byteArrayToDirection(byte[] bytes) {
    if (bytes.length != 1) {
      throw new IllegalArgumentException("Byte array must be exactly 1 byte.");
    }
    return (bytes[0] == 1) ? Direction.BUY : Direction.SELL;
  }
}
