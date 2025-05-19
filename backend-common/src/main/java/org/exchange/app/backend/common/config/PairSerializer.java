package org.exchange.app.backend.common.config;

import java.nio.charset.StandardCharsets;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.Serializer;
import org.exchange.app.common.api.model.Pair;

@Log4j2
public class PairSerializer implements Serializer<Pair> {

  @Override
  public byte[] serialize(String topic, Pair data) {
    if (data != null) {
      return data.toString().getBytes(StandardCharsets.UTF_8);
    } else {
      throw new IllegalStateException("Can't serialize object: " + data);
    }
  }
}
