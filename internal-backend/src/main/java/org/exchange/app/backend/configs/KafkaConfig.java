package org.exchange.app.backend.configs;

import exchange.app.common.api.model.Pair;
import java.util.stream.IntStream;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;

@Configuration
@EnableKafka
public class KafkaConfig {

  public static final String INPUT_RECORD_TOPIC_NAME = "input-record";
  public static final String BOOTSTRAP_ADDRESS = "localhost:9092";

  public static Pair toPair(int partition) {
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
