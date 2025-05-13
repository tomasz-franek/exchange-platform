package org.exchange.app.backend.producers;

import exchange.app.common.api.model.Pair;
import java.util.Map;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.header.Headers;
import org.apache.kafka.common.serialization.Serializer;

@Log4j2
public class PairSerializer implements Serializer<Object> {

  @Override
  public byte[] serialize(String topic, Headers headers, Object data) {
    return serialize(topic, data);
  }

  @Override
  public byte[] serialize(String topic, Object data) {
    if (data instanceof Pair pair) {
      return pair.toString().getBytes();
    } else {
      throw new IllegalStateException("Can't serialize object: " + data);
    }
  }

  @Override
  public void configure(Map<String, ?> configs, boolean isKey) {

  }

  @Override
  public void close() {

  }
}
