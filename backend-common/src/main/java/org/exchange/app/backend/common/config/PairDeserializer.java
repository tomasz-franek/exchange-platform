package org.exchange.app.backend.common.config;

import java.util.Arrays;
import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.common.api.model.Pair;

public class PairDeserializer implements Deserializer<Pair> {

  @Override
  public Pair deserialize(String s, byte[] bytes) {
    String pairString = Arrays.toString(bytes);
    return Pair.valueOf(pairString);
  }

}
