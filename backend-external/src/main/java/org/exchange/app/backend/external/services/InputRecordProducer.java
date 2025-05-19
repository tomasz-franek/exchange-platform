package org.exchange.app.backend.external.services;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.concurrent.CompletableFuture;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.common.api.model.UserTicket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class InputRecordProducer {

  private final KafkaTemplate<String, String> kafkaTemplate;

  public InputRecordProducer(@Autowired KafkaTemplate<String, String> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }

  public void sendMessage(UserTicket userTicket) throws JsonProcessingException {
    ObjectMapper objectMapper = new ObjectMapper();
    String userTicketString = objectMapper.writeValueAsString(userTicket);
    CompletableFuture<SendResult<String, String>> future = kafkaTemplate.send(
        KafkaConfig.INPUT_RECORD_TOPIC_NAME, userTicket.getPair().toString(), userTicketString);
    future.whenComplete((result, ex) -> {
      if (ex != null) {
        log.error("{}", ex.getMessage());
      }
    });
  }
}
