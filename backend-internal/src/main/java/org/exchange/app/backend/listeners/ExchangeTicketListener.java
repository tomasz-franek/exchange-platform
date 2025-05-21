package org.exchange.app.backend.listeners;

import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.exchange.builders.CoreTicket;
import org.exchange.controllers.ExchangeController;
import org.exchange.exceptions.ExchangeException;
import org.exchange.strategies.ratio.RatioStrategy;
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

  private final ExchangeController exchangeController;

  @Autowired
  ExchangeTicketListener(KafkaTemplate<Pair, UserTicket> kafkaTemplate,
      RatioStrategy ratioStrategy) {
    this.kafkaTemplate = kafkaTemplate;
    //todo read partition form kafka
    int partition = 0;
    Pair pair = KafkaConfig.pairFromPartitionNumber(partition);
    this.exchangeController = new ExchangeController(pair, ratioStrategy);
  }

  @KafkaHandler
  public void listen(@Payload UserTicket ticket) {
    log.info("Received exchange messages {}", ticket.toString());
    try {
      exchangeController.addCoreTicket(new CoreTicket(ticket.getId(), ticket.getValue(),
          ticket.getRatio(), ticket.getEpochUTC(), ticket.getIdUser()));
    } catch (ExchangeException e) {
      throw new RuntimeException(
          "Unable to add Core Ticket to exchange controller ", e);
    }
  }
}
