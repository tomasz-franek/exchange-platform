package org.exchange.app.backend.listeners;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.concurrent.CompletableFuture;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
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

@Log4j2
@Service
@KafkaListener(id = "topic-ticket-listener",
    topics = {KafkaConfig.EXTERNAL_TICKET_TOPIC},
    groupId = KafkaConfig.EXTERNAL_TICKET_GROUP,
    autoStartup = "${listen.auto.start:true}",
    properties = {
        "key.deserializer=" + KafkaConfig.PAIR_DESERIALIZER,
        "value.deserializer=" + KafkaConfig.USER_TICKET_DESERIALIZER
    },
    concurrency = "1")
public class UserTicketListener {

  private final KafkaTemplate<Pair, UserTicket> kafkaTemplate;

  private final ExchangeEventRepository exchangeEventRepository;

  UserTicketListener(@Autowired ExchangeEventRepository exchangeEventRepository,
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
    this.exchangeEventRepository = exchangeEventRepository;
    this.kafkaTemplate = KafkaConfig.pairUserTicketKafkaTemplate(
        KafkaConfig.INTERNAL_EXCHANGE_TOPIC, bootstrapServers);
  }

  @KafkaHandler
  public void listen(@Payload UserTicket ticket) {
    log.info("Received messages {}", ticket.toString());
    ExchangeEventEntity entity = new ExchangeEventEntity();

    entity.setUserAccountId(ticket.getIdUserAccount());
    entity.setPair(ticket.getPair());
    entity.setDirection(ticket.getDirection().equals(Direction.BUY) ? "B" : "S");
    entity.setDateUtc(Timestamp.valueOf(
        LocalDateTime.now().atZone(ZoneOffset.UTC).toLocalDateTime()));
    entity.setEventType("A");
    entity.setValue(ticket.getValue());
    entity.setRatio(ticket.getRatio());

    exchangeEventRepository.save(entity);
    log.info("*** Saved messages '{}'", entity.toString());
    sendMessage(ticket);

  }

  public void sendMessage(UserTicket userTicket) {
    CompletableFuture<SendResult<Pair, UserTicket>> future = kafkaTemplate.send(
        KafkaConfig.INTERNAL_EXCHANGE_TOPIC, userTicket.getPair(), userTicket);
    future.whenComplete((result, ex) -> {
      if (ex != null) {
        log.error("{}", ex.getMessage());
      } else {
        log.info("Sent Exchange OK");
      }
    });
  }
}
