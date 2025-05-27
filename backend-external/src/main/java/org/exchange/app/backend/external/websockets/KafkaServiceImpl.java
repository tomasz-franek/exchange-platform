package org.exchange.app.backend.external.websockets;

import java.io.IOException;
import java.util.Collections;
import java.util.Properties;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;
import reactor.kafka.receiver.ReceiverRecord;

@Service
public class KafkaServiceImpl implements KafkaService {


  private final Flux<ReceiverRecord<String, String>> orderBookStream;


  KafkaServiceImpl() throws IOException {

    Properties kafkaProperties = new Properties();

    kafkaProperties.put(ConsumerConfig.CLIENT_ID_CONFIG, "reactive-consumer");
    kafkaProperties.put(ConsumerConfig.GROUP_ID_CONFIG, KafkaConfig.EXTERNAL_ORDER_BOOK_GROUP);
    kafkaProperties.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
    kafkaProperties.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
    kafkaProperties.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

    ReceiverOptions<String, String> receiverOptions = ReceiverOptions.create(kafkaProperties);

    orderBookStream = createTopicCache(receiverOptions);
  }


  public Flux<ReceiverRecord<String, String>> getOrderBookStream() {

    return orderBookStream;
  }

  private <T, G> Flux<ReceiverRecord<T, G>> createTopicCache(
      ReceiverOptions<T, G> receiverOptions) {
    ReceiverOptions<T, G> options = receiverOptions.subscription(
        Collections.singleton(KafkaConfig.EXTERNAL_ORDER_BOOK_TOPIC));

    return KafkaReceiver.create(options).receive().cache();
  }

}
