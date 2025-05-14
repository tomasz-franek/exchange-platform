package org.exchange.app.backend.external;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.exchange.app.backend.common.config.CustomPartitioner;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.PairSerializer;
import org.exchange.app.common.api.model.KafkaOrderTicket;
import org.exchange.app.common.api.model.Pair;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

@SpringBootApplication
@EntityScan("org.exchange.app")
@RequiredArgsConstructor
public class ExchangeExternalBackendApplication {

  public static void main(String[] args) {
    SpringApplication app = new SpringApplication(ExchangeExternalBackendApplication.class);
    app.setDefaultProperties(Collections
        .singletonMap("server.port", "8080"));
    app.run(args);
  }

  @Bean
  public KafkaConfig kafkaConfig() {
    return new KafkaConfig();
  }

  @Bean
  public ProducerFactory<Pair, KafkaOrderTicket> producerFactory() {
    Map<String, Object> configProps = new HashMap<>();
    configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaConfig().getBootstrapServers());
    configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, PairSerializer.class);
    configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
    configProps.put(JsonSerializer.TYPE_MAPPINGS,
        "order:org.exchange.app.backend.configs.KafkaOrderTicket");
    configProps.put(ProducerConfig.PARTITIONER_CLASS_CONFIG, CustomPartitioner.class.getName());
    return new DefaultKafkaProducerFactory<>(configProps);
  }


  @Bean
  public KafkaTemplate<Pair, KafkaOrderTicket> kafkaTemplate() {
    return new KafkaTemplate<>(producerFactory());
  }
}
