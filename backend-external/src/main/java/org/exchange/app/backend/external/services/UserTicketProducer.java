package org.exchange.app.backend.external.services;

import java.util.concurrent.CompletableFuture;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;

@Log4j2
@Component
public class UserTicketProducer {

  @Value("${spring.kafka.producer.topic}")
  public String ticketTopic;

  private final KafkaTemplate<Pair, UserTicket> kafkaTemplate;

  public UserTicketProducer(@Autowired KafkaTemplate<Pair, UserTicket> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }

  public void sendMessage(UserTicket userTicket) {
    CompletableFuture<SendResult<Pair, UserTicket>> future = kafkaTemplate.send(
        ticketTopic, userTicket.getPair(), userTicket);
    future.whenComplete((result, ex) -> {
      if (ex != null) {
        log.error("{}", ex.getMessage());
      } else {
        log.info("Sent OK id={} topic={}",
            result.getProducerRecord().value().getId(),
            this.ticketTopic);
      }
    });
  }
}
