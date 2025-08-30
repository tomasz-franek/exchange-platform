package org.exchange.app.backend.common.utils;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import org.exchange.app.common.api.model.Pair;

public class PairUtils implements SerializationUtils<Pair> {

  public static int getSize() {
    return 1;
  }

  @Override
  public byte[] toByteArray(Pair pair, ByteArrayData data) {
    byte[] current;
    if (pair != null) {
      switch (pair) {
        case EUR_PLN -> current = new byte[]{(byte) 0};
        case USD_PLN -> current = new byte[]{(byte) 1};
        case CHF_PLN -> current = new byte[]{(byte) 2};
        case GBP_PLN -> current = new byte[]{(byte) 3};
        case EUR_USD -> current = new byte[]{(byte) 4};
        case EUR_CHF -> current = new byte[]{(byte) 5};
        case EUR_GBP -> current = new byte[]{(byte) 6};
        case GBP_USD -> current = new byte[]{(byte) 7};
        case USD_CHF -> current = new byte[]{(byte) 8};
        case GBP_CHF -> current = new byte[]{(byte) 9};
        default -> throw new IllegalStateException(
            String.format("Can't serialize object Pair: %s", pair));
      }

    } else {
      current = new byte[]{NULL_BYTE};
    }
    if (data != null) {
      System.arraycopy(current, 0, data.bytes, data.position, getSize());
      data.position += getSize();
    }
    return current;
  }

  @Override
  public Pair toObject(ByteArrayData data) {
    if (data.bytes == null || (data.bytes.length > 0 && data.bytes[data.position] == NULL_BYTE)) {
      data.position += getSize();
      return null;
    }
    try {
      return Pair.values()[data.bytes[data.position++]];
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing Pair", e);
    }
  }
}
