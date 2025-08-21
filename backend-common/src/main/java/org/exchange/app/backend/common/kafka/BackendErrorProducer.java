package org.exchange.app.backend.common.kafka;


import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class BackendErrorProducer {

  private final KafkaTemplate<String, String> kafkaTemplate;

  public BackendErrorProducer(
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
    this.kafkaTemplate = KafkaConfig.kafkaTemplateProducer(
        TopicToInternalBackend.ERROR, bootstrapServers, StringSerializer.class,
        StringSerializer.class);
  }

  public void sendMessage(String error) {
    CompletableFuture<SendResult<String, String>> future
        = kafkaTemplate.send(TopicToInternalBackend.ERROR, UUID.randomUUID().toString(), error);
    future.whenComplete((result, ex) -> {
      if (ex != null) {
        log.error("{}", ex.getMessage());
      } else {
        log.info("Sent OK to error topic {}", TopicToInternalBackend.ERROR);
      }
    });
  }
}
