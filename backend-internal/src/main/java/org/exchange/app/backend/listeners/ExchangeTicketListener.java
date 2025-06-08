package org.exchange.app.backend.listeners;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.exchange.builders.CoreTicket;
import org.exchange.exceptions.ExchangeException;
import org.exchange.services.ExchangeService;
import org.exchange.strategies.ratio.RatioStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@KafkaListener(id = "topic-exchange-listener",
    topics = KafkaConfig.InternalTopics.EXCHANGE,
    groupId = KafkaConfig.InternalGroups.EXCHANGE,
    autoStartup = KafkaConfig.AUTO_STARTUP_TRUE,
    properties = {
        "key.deserializer=" + KafkaConfig.Deserializers.PAIR,
        "value.deserializer=" + KafkaConfig.Deserializers.USER_TICKET
    },
    concurrency = "1")
public class ExchangeTicketListener {

  private final RatioStrategy ratioStrategy;
  private final ConcurrentHashMap<Pair, ExchangeService> exchangeServiceConcurrentHashMap;
  private final KafkaTemplate<String, String> kafkaOrderBookTemplate;

  @Autowired
  ExchangeTicketListener(RatioStrategy ratioStrategy,
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
    this.exchangeServiceConcurrentHashMap = new ConcurrentHashMap<>(Pair.values().length);
    this.ratioStrategy = ratioStrategy;
    this.kafkaOrderBookTemplate = KafkaConfig.kafkaTemplateProducer(
        KafkaConfig.ExternalTopics.ORDER_BOOK, bootstrapServers,
        StringSerializer.class,
        StringSerializer.class);
  }

  @KafkaHandler
  public void listen(@Payload UserTicket ticket) {
    log.info("*** Received exchange messages {}", ticket.toString());
    try {
      ExchangeService exchangeService = this.exchangeServiceConcurrentHashMap.getOrDefault(
          ticket.getPair(), new ExchangeService(ticket.getPair(), this.ratioStrategy));
      exchangeService.addCoreTicket(new CoreTicket(ticket.getId(), ticket.getAmount(),
          ticket.getRatio(), ticket.getEpochUTC(), ticket.getUserId(), ticket.getPair(),
          ticket.getDirection()));
      exchangeService.doExchange();
      this.exchangeServiceConcurrentHashMap.putIfAbsent(ticket.getPair(), exchangeService);

      CompletableFuture<SendResult<String, String>> futureOrderBook =
          kafkaOrderBookTemplate.send(KafkaConfig.ExternalTopics.ORDER_BOOK,
              ticket.toString());
      futureOrderBook.whenComplete((result, ex) -> {
        if (ex != null) {
          log.error("{}", ex.getMessage());
        } else {
          log.info("Sent Order Book OK");
        }
      });
    } catch (ExchangeException e) {
      throw new RuntimeException(
          "Unable to add Core Ticket to exchange controller ", e);
    }
  }
}
