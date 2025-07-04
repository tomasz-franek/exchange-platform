package org.exchange.app.backend.common.deserializers;

import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.common.api.model.Pair;

public class PairDeserializer implements Deserializer<Pair> {

  @Override
  public Pair deserialize(String s, byte[] bytes) {
    try {
      return Pair.values()[bytes[0]];
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing Pair", e);
    }
  }
}
