package org.exchange.app.backend.external.producers;

import java.util.concurrent.CompletableFuture;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.serializers.UserAccountOperationSerializer;
import org.exchange.app.external.api.model.UserAccountOperation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class UserAccountOperationProducer {

  private final static String PRODUCER_TOPIC = KafkaConfig.ExternalTopics.ACCOUNT;
  private final KafkaTemplate<String, UserAccountOperation> kafkaTemplate;

  public UserAccountOperationProducer(
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
    this.kafkaTemplate = KafkaConfig.kafkaTemplateProducer(
        PRODUCER_TOPIC, bootstrapServers, StringSerializer.class,
        UserAccountOperationSerializer.class);
  }

  public void sendMessage(String operation, UserAccountOperation userAccountOperation) {
    log.error("{} {}", operation, userAccountOperation);
    CompletableFuture<SendResult<String, UserAccountOperation>> future
        = kafkaTemplate.send(PRODUCER_TOPIC, operation, userAccountOperation);
    future.whenComplete((result, ex) -> {
      if (ex != null) {
        log.error("{}", ex.getMessage());
      } else {
        log.info("Sent OK id={} topic={}",
            result.getProducerRecord().value().getIdUser(),
            PRODUCER_TOPIC);
      }
    });
  }
}
