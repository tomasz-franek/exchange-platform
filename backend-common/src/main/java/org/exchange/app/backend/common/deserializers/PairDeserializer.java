package org.exchange.app.backend.common.deserializers;

import static org.exchange.app.backend.common.serializers.PairSerializer.NULL_BYTE;

import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.common.api.model.Pair;

public class PairDeserializer implements Deserializer<Pair> {

  @Override
  public Pair deserialize(String s, byte[] bytes) {
    if (bytes == null || (bytes.length > 0 && bytes[0] == NULL_BYTE)) {
      return null;
    }
    try {
      return Pair.values()[bytes[0]];
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing Pair", e);
    }
  }
}
