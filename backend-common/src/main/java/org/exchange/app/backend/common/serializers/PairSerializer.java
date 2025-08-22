package org.exchange.app.backend.common.serializers;

import org.apache.kafka.common.serialization.Serializer;
import org.exchange.app.common.api.model.Pair;

public class PairSerializer implements Serializer<Pair> {

  public static byte NULL_BYTE = Byte.MIN_VALUE;

  @Override
  public byte[] serialize(String topic, Pair pair) {
    if (pair != null) {
      switch (pair) {
        case EUR_PLN -> {
          return new byte[]{(byte) 0};
        }
        case USD_PLN -> {
          return new byte[]{(byte) 1};
        }
        case CHF_PLN -> {
          return new byte[]{(byte) 2};
        }
        case GBP_PLN -> {
          return new byte[]{(byte) 3};
        }
        case EUR_USD -> {
          return new byte[]{(byte) 4};
        }
        case EUR_CHF -> {
          return new byte[]{(byte) 5};
        }
        case EUR_GBP -> {
          return new byte[]{(byte) 6};
        }
        case GBP_USD -> {
          return new byte[]{(byte) 7};
        }
        case USD_CHF -> {
          return new byte[]{(byte) 8};
        }
        case GBP_CHF -> {
          return new byte[]{(byte) 9};
        }
        default -> throw new IllegalStateException(
            String.format("Can't serialize object Pair: %s", pair));
      }

    } else {
      return new byte[]{NULL_BYTE};
    }
  }
}
