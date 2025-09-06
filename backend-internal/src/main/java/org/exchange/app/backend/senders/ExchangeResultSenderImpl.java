package org.exchange.app.backend.senders;

import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.builders.ExchangeResult;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.common.serializers.ExchangeResultSerializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class ExchangeResultSenderImpl implements ExchangeResultSender {

  private final KafkaTemplate<String, ExchangeResult> kafkaTemplate;

  @Autowired
  public ExchangeResultSenderImpl(
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
    this.kafkaTemplate = KafkaConfig.kafkaTemplateProducer(
        TopicToInternalBackend.EXCHANGE_RESULT, bootstrapServers,
        StringSerializer.class,
        ExchangeResultSerializer.class);
  }

  public ExchangeResultSenderImpl(KafkaTemplate<String, ExchangeResult> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }

  @Override
  public void sendExchangeResult(ExchangeResult exchangeResult) {
    this.kafkaTemplate.send(TopicToInternalBackend.EXCHANGE_RESULT, "", exchangeResult);

  }
}
