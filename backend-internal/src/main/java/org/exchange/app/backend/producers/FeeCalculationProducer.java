package org.exchange.app.backend.producers;

import java.util.concurrent.CompletableFuture;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.common.serializers.UserAccountOperationSerializer;
import org.exchange.internal.app.core.builders.CoreTicket;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class FeeCalculationProducer {

  private final KafkaTemplate<String, String> kafkaTemplate;

  public FeeCalculationProducer(
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
    this.kafkaTemplate = KafkaConfig.kafkaTemplateProducer(
        TopicToInternalBackend.FEE_CALCULATION, bootstrapServers, StringSerializer.class,
        UserAccountOperationSerializer.class);
  }

  public void sendMessage(String operation, CoreTicket coreTicket) {
    String feeCalculationRequest =
        coreTicket.getUserId() + ":" + coreTicket.getIdCurrency() + ":" + coreTicket.getAmount();
    CompletableFuture<SendResult<String, String>> future
        = kafkaTemplate.send(TopicToInternalBackend.FEE_CALCULATION, operation,
        feeCalculationRequest);
    future.whenComplete((result, ex) -> {
      if (ex != null) {
        log.error("{}", ex.getMessage());
      } else {
        log.info("Sent OK id={} topic={}",
            result.getProducerRecord().value(),
            TopicToInternalBackend.FEE_CALCULATION);
      }
    });
  }
}
