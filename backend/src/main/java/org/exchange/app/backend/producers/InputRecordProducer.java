package org.exchange.app.backend.producers;

import exchange.app.api.model.OrderTicket;
import exchange.app.api.model.Pair;
import java.util.concurrent.CompletableFuture;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.configs.KafkaConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class InputRecordProducer {

  private final KafkaTemplate<String, OrderTicket> kafkaTemplate;

  public InputRecordProducer(@Autowired KafkaTemplate<String, OrderTicket> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }

  public void sendMessage(OrderTicket orderTicket, Pair pair) {
    CompletableFuture<SendResult<String, OrderTicket>> future = kafkaTemplate.send(
        KafkaConfig.INPUT_RECORD_TOPIC_NAME, pair.toString(), orderTicket);
    future.whenComplete((result, ex) -> {
    });
  }
}
