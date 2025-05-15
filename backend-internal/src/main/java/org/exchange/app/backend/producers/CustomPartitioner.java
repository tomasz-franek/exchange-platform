package org.exchange.app.backend.producers;

import java.util.HashMap;
import java.util.Map;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.clients.producer.Partitioner;
import org.apache.kafka.common.Cluster;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.common.api.model.Pair;

@Log4j2
public class CustomPartitioner implements Partitioner {

  private final Map<String, Integer> stringIntegerPairMap;
  private final Map<Pair, Integer> pairIntegerPairMap;
  public static final int WRONG_PARTITION = 99;

  public CustomPartitioner() {
    stringIntegerPairMap = new HashMap<>(Pair.values().length);
    pairIntegerPairMap = new HashMap<>(Pair.values().length);
    for (Pair pair : Pair.values()) {
      int partition = KafkaConfig.toPartitionNumber(pair);
      stringIntegerPairMap.put(pair.toString(), partition);
      pairIntegerPairMap.put(pair, partition);
    }
  }

  @Override
  public int partition(String topic, Object key, byte[] keyBytes, Object value, byte[] valueBytes,
      Cluster cluster) {
    if (key instanceof String pairString) {
      return stringIntegerPairMap.getOrDefault(pairString, WRONG_PARTITION);
    }
    if (key instanceof Pair pair) {
      return pairIntegerPairMap.getOrDefault(pair, WRONG_PARTITION);
    }
    log.error("Unable to get partition from {}", key);
    return WRONG_PARTITION;
  }

  @Override
  public void close() {
    stringIntegerPairMap.clear();
    pairIntegerPairMap.clear();
  }

  @Override
  public void configure(Map<String, ?> map) {

  }
}
