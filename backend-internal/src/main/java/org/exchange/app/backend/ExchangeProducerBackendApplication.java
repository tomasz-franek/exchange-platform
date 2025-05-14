package org.exchange.app.backend;


import java.util.Collections;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

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

//  @Bean
//  public KafkaConfig kafkaConfig() {
//    return new KafkaConfig();
//  }

//  @Bean
//  public ProducerFactory<Pair, KafkaOrderTicket> producerFactory() {
//    Map<String, Object> configProps = new HashMap<>();
//    configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaConfig().getBootstrapServers());
//    configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, PairSerializer.class);
//    configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
//    configProps.put(JsonSerializer.TYPE_MAPPINGS,
//        "order:org.exchange.app.backend.configs.KafkaOrderTicket");
//    configProps.put(ProducerConfig.PARTITIONER_CLASS_CONFIG, CustomPartitioner.class.getName());
//    return new DefaultKafkaProducerFactory<>(configProps);
//  }
//
//
//  @Bean
//  public KafkaTemplate<Pair, KafkaOrderTicket> kafkaTemplate() {
//    return new KafkaTemplate<>(producerFactory());
//  }
}
