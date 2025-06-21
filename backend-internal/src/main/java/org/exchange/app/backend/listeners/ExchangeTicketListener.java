package org.exchange.app.backend.listeners;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.common.config.KafkaConfig.TopicsToExternalBackend;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.exchange.internal.app.core.builders.CoreTicket;
import org.exchange.internal.app.core.data.ExchangeResult;
import org.exchange.internal.app.core.exceptions.ExchangeException;
import org.exchange.internal.app.core.services.ExchangeService;
import org.exchange.internal.app.core.strategies.ratio.RatioStrategy;
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
    topics = TopicToInternalBackend.EXCHANGE,
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
  private final KafkaTemplate<String, String> kafkaExchangeResultTemplate;
  private final KafkaTemplate<String, String> kafkaOrderBookTemplate;
  private final ObjectMapper objectMapper;

  @Autowired
  ExchangeTicketListener(RatioStrategy ratioStrategy,
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers,
      ObjectMapper objectMapper) {
    this.exchangeServiceConcurrentHashMap = new ConcurrentHashMap<>(Pair.values().length);
    this.ratioStrategy = ratioStrategy;
    this.objectMapper = objectMapper;
    this.kafkaExchangeResultTemplate = KafkaConfig.kafkaTemplateProducer(
        TopicToInternalBackend.EXCHANGE_RESULT, bootstrapServers,
        StringSerializer.class,
        StringSerializer.class);
    this.kafkaOrderBookTemplate = KafkaConfig.kafkaTemplateProducer(
        TopicsToExternalBackend.ORDER_BOOK, bootstrapServers,
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
      ExchangeResult exchangeResult = exchangeService.doExchange();
      String orderBookCurrentStateAfterExchange = exchangeService.getOrderBook();
      this.kafkaOrderBookTemplate.send(TopicsToExternalBackend.ORDER_BOOK,
          orderBookCurrentStateAfterExchange);
      this.exchangeServiceConcurrentHashMap.put(ticket.getPair(), exchangeService);
      if (exchangeResult != null) {
        String resultJsonString;
        try {
          resultJsonString = objectMapper.writeValueAsString(exchangeResult);
          log.info(resultJsonString);
        } catch (JsonProcessingException e) {
          throw new RuntimeException(e);
        }
        CompletableFuture<SendResult<String, String>> futureOrderBook =
            kafkaExchangeResultTemplate.send(TopicToInternalBackend.EXCHANGE_RESULT,
                resultJsonString.toString());

        futureOrderBook.whenComplete((result, ex) -> {
          if (ex != null) {
            log.error("{}", ex.getMessage());
          } else {
            log.info("Sent Order Book OK");
          }
        });
      }

    } catch (ExchangeException e) {
      throw new RuntimeException(
          "Unable to add Core Ticket to exchange controller ", e);
    }
  }
}
