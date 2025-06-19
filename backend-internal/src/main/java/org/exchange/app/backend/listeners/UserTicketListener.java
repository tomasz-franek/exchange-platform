package org.exchange.app.backend.listeners;

import java.util.concurrent.CompletableFuture;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.common.serializers.PairSerializer;
import org.exchange.app.backend.common.serializers.UserTicketSerializer;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@KafkaListener(id = "topic-ticket-listener",
    topics = {TopicToInternalBackend.TICKET},
    groupId = KafkaConfig.ExternalGroups.TICKET,
    autoStartup = KafkaConfig.AUTO_STARTUP_TRUE,
    properties = {
        "key.deserializer=" + Deserializers.PAIR,
        "value.deserializer=" + Deserializers.USER_TICKET
    },
    concurrency = "1")
public class UserTicketListener {

  private final KafkaTemplate<Pair, UserTicket> kafkaTemplate;

  private final ExchangeEventRepository exchangeEventRepository;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;

  UserTicketListener(@Autowired ExchangeEventSourceRepository exchangeEventSourceRepository,
      @Autowired ExchangeEventRepository exchangeEventRepository,
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
    this.exchangeEventRepository = exchangeEventRepository;
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    this.kafkaTemplate = KafkaConfig.kafkaTemplateProducer(
        TopicToInternalBackend.EXCHANGE,
        bootstrapServers,
        PairSerializer.class,
        UserTicketSerializer.class);
  }

  @KafkaHandler
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void listen(@Payload UserTicket ticket) {
    log.info("Received messages {}", ticket.toString());
    ExchangeEventSourceEntity exchangeEventSourceEntity = new ExchangeEventSourceEntity();

    exchangeEventSourceEntity.setUserAccountId(ticket.getUserAccountId());
    exchangeEventSourceEntity.setDateUtc(ExchangeDateUtils.currentTimestamp());
    exchangeEventSourceEntity.setEventType(ticket.getEventType());
    exchangeEventSourceEntity.setAmount(-ticket.getAmount());

    ExchangeEventEntity exchangeEventEntity = new ExchangeEventEntity();

    exchangeEventEntity.setUserAccountId(ticket.getUserAccountId());
    exchangeEventEntity.setPair(ticket.getPair());
    exchangeEventEntity.setDirection(ticket.getDirection().equals(Direction.BUY) ? "B" : "S");
    exchangeEventEntity.setDateUtc(ExchangeDateUtils.currentTimestamp());
    exchangeEventEntity.setEventType(ticket.getEventType());
    exchangeEventEntity.setAmount(ticket.getAmount());
    exchangeEventEntity.setRatio(ticket.getRatio());

    exchangeEventSourceRepository.save(exchangeEventSourceEntity);
    exchangeEventRepository.save(exchangeEventEntity);
    log.info("*** Saved messages '{}'", exchangeEventEntity.toString());
    sendMessage(ticket);

  }

  public void sendMessage(UserTicket userTicket) {
    CompletableFuture<SendResult<Pair, UserTicket>> future = kafkaTemplate.send(
        TopicToInternalBackend.EXCHANGE, userTicket.getPair(), userTicket);
    future.whenComplete((result, ex) -> {
      if (ex != null) {
        log.error("{}", ex.getMessage());
      } else {
        log.info("Sent Exchange OK");
      }
    });
  }
}
