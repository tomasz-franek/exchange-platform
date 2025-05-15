package org.exchange.app.backend.external.services;

import java.util.concurrent.CompletableFuture;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class InputRecordProducer {

  private final KafkaTemplate<Pair, UserTicket> kafkaTemplate;

  public InputRecordProducer(@Autowired KafkaTemplate<Pair, UserTicket> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }

  public void sendMessage(UserTicket userTicket, Pair pair) {
    CompletableFuture<SendResult<Pair, UserTicket>> future = kafkaTemplate.send(
        KafkaConfig.INPUT_RECORD_TOPIC_NAME, pair, userTicket);
    future.whenComplete((result, ex) -> {
      if (ex != null) {
        log.error("{}", ex.getMessage());
      }
    });
  }
}
