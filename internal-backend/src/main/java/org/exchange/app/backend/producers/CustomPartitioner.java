package org.exchange.app.backend.producers;

import exchange.app.internal.api.model.Pair;
import java.util.HashMap;
import java.util.Map;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.clients.producer.Partitioner;
import org.apache.kafka.common.Cluster;
import org.exchange.app.backend.configs.KafkaConfig;

@Log4j2
public class CustomPartitioner implements Partitioner {

  private final Map<String, Integer> stringIntegerMap;

  public CustomPartitioner() {
    stringIntegerMap = new HashMap<>(Pair.values().length);
    for (Pair pair : Pair.values()) {
      stringIntegerMap.put(pair.toString(), KafkaConfig.toPartitionNumber(pair));
    }
  }

  @Override
  public int partition(String topic, Object key, byte[] keyBytes, Object value, byte[] valueBytes,
      Cluster cluster) {
    if (key instanceof String pairString) {
      return stringIntegerMap.get(pairString);
    }
    if (key instanceof Pair pair) {
      return KafkaConfig.toPartitionNumber(pair);
    }
    log.error("Unable to get partition from {}", key);
    return -1;
  }

  @Override
  public void close() {

  }

  @Override
  public void configure(Map<String, ?> map) {

  }
}
