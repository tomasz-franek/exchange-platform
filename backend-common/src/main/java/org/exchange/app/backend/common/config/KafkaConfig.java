package org.exchange.app.backend.common.config;

import java.util.stream.IntStream;
import org.exchange.app.common.api.model.Pair;

public class KafkaConfig {
  
  public static int toPartitionNumber(Pair pair) {
    return IntStream.range(0, Pair.values().length)
        .filter(i -> pair.equals(Pair.values()[i]))
        .findFirst().orElse(-1);
  }
}
