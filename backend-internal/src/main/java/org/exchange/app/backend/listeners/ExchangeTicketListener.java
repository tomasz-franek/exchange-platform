package org.exchange.app.backend.listeners;

import lombok.extern.log4j.Log4j2;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@KafkaListener(id = "topic-exchange-listener",
    topics = "${spring.kafka.consumers.consumers-exchange.topic}",
    groupId = "${spring.kafka.consumers.consumers-exchange.group}",
    autoStartup = "${listen.auto.start:true}",
    properties = {
        "key.deserializer=${spring.kafka.consumers.consumers-exchange.key-deserializer}",
        "value.deserializer=${spring.kafka.consumers.consumers-exchange.value-deserializer}"
    },
    concurrency = "1")
public class ExchangeTicketListener {

  private final KafkaTemplate<Pair, UserTicket> kafkaTemplate;

  ExchangeTicketListener(@Autowired KafkaTemplate<Pair, UserTicket> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }

  @KafkaHandler
  public void listen(@Payload UserTicket ticket) {
    log.info("Received exchange messages xxxx {}", ticket.toString());
  }
}
