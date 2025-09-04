package org.exchange.app.backend.admin.producers;

import java.util.concurrent.CompletableFuture;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.common.serializers.UserAccountOperationSerializer;
import org.exchange.app.common.api.model.UserAccountOperation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class CashTransactionProducer {

  private final KafkaTemplate<String, UserAccountOperation> kafkaTemplate;

  public CashTransactionProducer(
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
    this.kafkaTemplate = KafkaConfig.kafkaTemplateProducer(
        TopicToInternalBackend.CASH_TRANSACTION, bootstrapServers, StringSerializer.class,
        UserAccountOperationSerializer.class);
  }

  public void sendMessage(String operation, UserAccountOperation userAccountOperation) {
    CompletableFuture<SendResult<String, UserAccountOperation>> future
        = kafkaTemplate.send(TopicToInternalBackend.CASH_TRANSACTION, operation,
        userAccountOperation);
    future.whenComplete((result, ex) -> {
      if (ex != null) {
        log.error("{}", ex.getMessage());
      } else {
        log.info("Sent OK id={} topic={}",
            result.getProducerRecord().value().getUserId(),
            TopicToInternalBackend.CASH_TRANSACTION);
      }
    });
  }
}
