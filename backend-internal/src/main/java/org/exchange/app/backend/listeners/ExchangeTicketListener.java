package org.exchange.app.backend.listeners;

import java.util.concurrent.ConcurrentHashMap;
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
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@KafkaListener(id = "topic-exchange-listener",
    topics = KafkaConfig.INTERNAL_EXCHANGE_TOPIC,
    groupId = KafkaConfig.INTERNAL_EXCHANGE_GROUP,
    autoStartup = "${listen.auto.start:true}",
    properties = {
        "key.deserializer=" + KafkaConfig.PAIR_DESERIALIZER,
        "value.deserializer=" + KafkaConfig.USER_TICKET_DESERIALIZER
    },
    concurrency = "1")
public class ExchangeTicketListener {

  private final RatioStrategy ratioStrategy;
  private final ConcurrentHashMap<Pair, ExchangeController> exchangeControllerConcurrentHashMap;

  @Autowired
  ExchangeTicketListener(RatioStrategy ratioStrategy) {
    this.exchangeControllerConcurrentHashMap = new ConcurrentHashMap<>(Pair.values().length);
    this.ratioStrategy = ratioStrategy;
  }

  @KafkaHandler
  public void listen(@Payload UserTicket ticket) {
    log.info("*** Received exchange messages {}", ticket.toString());
    try {
      ExchangeController exchangeController = this.exchangeControllerConcurrentHashMap.getOrDefault(
          ticket.getPair(), new ExchangeController(ticket.getPair(), this.ratioStrategy));
      exchangeController.addCoreTicket(new CoreTicket(ticket.getId(), ticket.getValue(),
          ticket.getRatio(), ticket.getEpochUTC(), ticket.getIdUser(), ticket.getPair(),
          ticket.getDirection()));
      exchangeController.doExchange();
      this.exchangeControllerConcurrentHashMap.putIfAbsent(ticket.getPair(), exchangeController);
    } catch (ExchangeException e) {
      throw new RuntimeException(
          "Unable to add Core Ticket to exchange controller ", e);
    }
  }
}
