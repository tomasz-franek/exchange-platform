package org.exchange.app.backend.common.config;

import java.util.stream.IntStream;
import org.exchange.app.common.api.model.Pair;

public class KafkaConfig {


  public static Pair pairFromPartitionNumber(int partition) {
    assert partition >= 0;
    assert partition < Pair.values().length;
    return Pair.values()[partition];
  }

  public static int toPartitionNumber(Pair pair) {
    return IntStream.range(0, Pair.values().length)
        .filter(i -> pair.equals(Pair.values()[i]))
        .findFirst().orElse(-1);
  }
}
