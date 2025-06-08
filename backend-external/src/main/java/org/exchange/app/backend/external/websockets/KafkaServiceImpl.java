package org.exchange.app.backend.external.websockets;

import java.io.IOException;
import java.util.Collections;
import java.util.Properties;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.ExternalGroups;
import org.exchange.app.backend.common.config.KafkaConfig.TopicsToExternalBackend;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.kafka.receiver.KafkaReceiver;
import reactor.kafka.receiver.ReceiverOptions;
import reactor.kafka.receiver.ReceiverRecord;

@Service
public class KafkaServiceImpl implements KafkaService {


  private final Flux<ReceiverRecord<String, String>> orderBookStream;


  KafkaServiceImpl(@Value("${spring.kafka.bootstrap-servers}") String bootstrapServers)
      throws IOException {

    Properties kafkaProperties = KafkaConfig.consumerConfigProperties(bootstrapServers,
        ExternalGroups.ORDER_BOOK, StringDeserializer.class, StringDeserializer.class);

    kafkaProperties.put(ConsumerConfig.CLIENT_ID_CONFIG, "reactive-consumer");
    kafkaProperties.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

    ReceiverOptions<String, String> receiverOptions = ReceiverOptions.create(kafkaProperties);

    orderBookStream = createTopicCache(receiverOptions, TopicsToExternalBackend.ORDER_BOOK);
  }


  public Flux<ReceiverRecord<String, String>> getOrderBookStream() {

    return orderBookStream;
  }

  private <T, G> Flux<ReceiverRecord<T, G>> createTopicCache(
      ReceiverOptions<T, G> receiverOptions, String topic) {
    ReceiverOptions<T, G> options = receiverOptions.subscription(
        Collections.singleton(topic));

    return KafkaReceiver.create(options).receive().cache();
  }

}
