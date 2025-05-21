package org.exchange.app.backend.listeners;

import lombok.extern.log4j.Log4j2;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@KafkaListener(id = "topic-exchange-idw",
    topics = "#{__listener.exchangeTopic}", groupId = "#{__listener.exchangeGroupId}",
    autoStartup = "${listen.auto.start:true}",
    concurrency = "1")
public class ExchangeTicketListener {

  private final KafkaTemplate<Pair, UserTicket> kafkaTemplate;

  @Value("${spring.kafka.consumers.consumers-exchange.topic}")
  public String exchangeTopic;

  @Value("${spring.kafka.consumers.consumers-exchange.group}")
  public String exchangeGroupId;

  ExchangeTicketListener(@Autowired KafkaTemplate<Pair, UserTicket> kafkaTemplate) {
    this.kafkaTemplate = kafkaTemplate;
  }

  @KafkaHandler
  public void listen(@Payload UserTicket ticket) {
    log.info("Received exchange messages {}", ticket.toString());
  }
}
