package org.exchange.app.backend.common.serializers;

import java.nio.charset.StandardCharsets;
import org.apache.kafka.common.serialization.Serializer;
import org.exchange.app.common.api.model.Pair;

public class PairSerializer implements Serializer<Pair> {

  @Override
  public byte[] serialize(String topic, Pair pair) {
    if (pair != null) {
      return pair.toString().getBytes(StandardCharsets.UTF_8);
    } else {
      throw new IllegalStateException("Can't serialize object Pair: null");
    }
  }
}
