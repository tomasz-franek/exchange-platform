package org.exchange.app.backend;


import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.configs.KafkaConfig;
import org.exchange.app.backend.configs.KafkaOrderTicket;
import org.exchange.app.backend.producers.CustomPartitioner;
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
public class ExchangeProducerBackendApplication {

  public static void main(String[] args) {
    SpringApplication app = new SpringApplication(ExchangeProducerBackendApplication.class);
    app.setDefaultProperties(Collections
        .singletonMap("server.port", "8001"));
    app.run(args);
  }

  @Bean
  public ProducerFactory<String, KafkaOrderTicket> producerFactory() {
    Map<String, Object> configProps = new HashMap<>();
    configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, KafkaConfig.BOOTSTRAP_ADDRESS);
    configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
    configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
    configProps.put(JsonSerializer.TYPE_MAPPINGS,
        "order:org.exchange.app.backend.configs.KafkaOrderTicket");
    configProps.put(ProducerConfig.PARTITIONER_CLASS_CONFIG, CustomPartitioner.class.getName());
    return new DefaultKafkaProducerFactory<>(configProps);
  }


  @Bean
  public KafkaTemplate<String, KafkaOrderTicket> kafkaTemplate() {
    return new KafkaTemplate<>(producerFactory());
  }
}
