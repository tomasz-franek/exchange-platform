package org.exchange.app.backend.senders;

import java.util.concurrent.CompletableFuture;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.KafkaException;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.builders.ExchangeResult;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.common.serializers.ExchangeResultSerializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class ExchangeResultSenderImpl implements ExchangeResultSender {

  private final KafkaTemplate<String, ExchangeResult> kafkaTemplate;

  public ExchangeResultSenderImpl(
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
    this.kafkaTemplate = KafkaConfig.kafkaTemplateProducer(
        TopicToInternalBackend.EXCHANGE_RESULT, bootstrapServers,
        StringSerializer.class,
        ExchangeResultSerializer.class);
  }

  @Autowired
  public ExchangeResultSenderImpl(KafkaTemplate<String, ExchangeResult> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }

  @Override
  public void sendExchangeResult(ExchangeResult exchangeResult) {
    CompletableFuture<SendResult<String, ExchangeResult>> future = this.kafkaTemplate.sendDefault(
        exchangeResult);
    future.whenComplete((result, ex) -> {
      if (ex == null) {
        logSuccess(result);
      } else {
        logError(ex, exchangeResult);
      }
    });
  }

  private void logError(Throwable ex, ExchangeResult exchangeResult) {
    if (ex instanceof KafkaException) {
      log.error("Kafka error while sending message: {}", ex.getMessage());
    } else {
      log.error("Unexpected error while sending message: {}", ex.getMessage());
    }
    log.error(exchangeResult);
  }

  private void logSuccess(SendResult<String, ExchangeResult> result) {
    log.info("Sent message with offset: {}", result.getRecordMetadata().offset());
  }
}
