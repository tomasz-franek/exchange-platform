package org.exchange.app.backend.common.deserializers;

import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.common.api.model.Pair;

public class PairDeserializer implements Deserializer<Pair> {

  @Override
  public Pair deserialize(String s, byte[] bytes) {
    try {
      String pairString = new String(bytes);
      return Pair.valueOf(pairString);
    } catch (Exception e) {
      throw new RuntimeException("Error deserializing Pair", e);
    }
  }
}
