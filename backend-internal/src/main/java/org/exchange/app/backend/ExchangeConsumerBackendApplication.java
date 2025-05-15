package org.exchange.app.backend;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.exchange.app.backend.configs.KafkaConfig;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.KafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.ConcurrentMessageListenerContainer;
import org.springframework.kafka.support.serializer.JsonDeserializer;

@SpringBootApplication
@EntityScan("org.exchange.app")
@RequiredArgsConstructor
public class ExchangeConsumerBackendApplication {

  public static void main(String[] args) {
    SpringApplication app = new SpringApplication(ExchangeConsumerBackendApplication.class);
    app.setDefaultProperties(Collections
        .singletonMap("server.port", "8002"));
    app.run(args);
  }

  @Bean
  public ConsumerFactory<Pair, UserTicket> consumerFactory() {
    return new DefaultKafkaConsumerFactory<>(consumerConfigs());
  }

  @Bean
  public KafkaConfig kafkaConfig() {
    return new KafkaConfig();
  }

  @Bean
  public Map<String, Object> consumerConfigs() {
    Map<String, Object> props = new HashMap<>();
    props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "PLAINTEXT://kafka:9092");
    props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
    props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
    props.put(JsonDeserializer.TYPE_MAPPINGS,
        "order:org.exchange.app.common.api.UserTicket");
    return props;
  }

  @Bean
  KafkaListenerContainerFactory<ConcurrentMessageListenerContainer<Pair, UserTicket>>
  kafkaListenerContainerFactory() {
    ConcurrentKafkaListenerContainerFactory<Pair, UserTicket> factory =
        new ConcurrentKafkaListenerContainerFactory<>();
    factory.setConsumerFactory(consumerFactory());
    factory.setChangeConsumerThreadName(true);
    factory.setConcurrency(3);
    factory.getContainerProperties().setPollTimeout(10);
    factory.setBatchListener(true);
    return factory;
  }
}
