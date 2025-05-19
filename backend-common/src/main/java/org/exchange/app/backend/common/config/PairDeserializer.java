package org.exchange.app.backend.common.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.common.errors.SerializationException;
import org.apache.kafka.common.serialization.Deserializer;
import org.exchange.app.common.api.model.Pair;

public class PairDeserializer implements Deserializer<Pair> {

  @Override
  public Pair deserialize(String s, byte[] bytes) {
    try {
      ObjectMapper objectMapper = new ObjectMapper();
      return objectMapper.readValue(bytes, Pair.class);
    } catch (Exception e) {
      throw new SerializationException(e);
    }
  }

}
