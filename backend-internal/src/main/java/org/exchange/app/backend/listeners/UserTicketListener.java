package org.exchange.app.backend.listeners;

import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.common.serializers.PairSerializer;
import org.exchange.app.backend.common.serializers.UserTicketSerializer;
import org.exchange.app.backend.common.utils.CurrencyUtils;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.services.PlatformAccountService;
import org.exchange.app.backend.db.utils.ChecksumUtil;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.Pair;
import org.exchange.app.common.api.model.UserTicket;
import org.exchange.app.common.api.model.UserTicketStatus;
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
  private final PlatformAccountService platformAccountService;

  UserTicketListener(@Autowired ExchangeEventSourceRepository exchangeEventSourceRepository,
      @Autowired ExchangeEventRepository exchangeEventRepository,
      @Autowired PlatformAccountService platformAccountService,
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers) {
    this.exchangeEventRepository = exchangeEventRepository;
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    this.platformAccountService = platformAccountService;
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
    if (EventType.ORDER.equals(ticket.getEventType())) {
      ExchangeEventSourceEntity userTicketData = getUserTicketExchangeEventSource(
          ticket);

      ExchangeEventSourceEntity exchangeTicketData = getExchangeEventSourceEntity(
          userTicketData);

      ExchangeEventEntity exchangeEventEntity = new ExchangeEventEntity();

      exchangeEventEntity.setUserAccountId(ticket.getUserAccountId());
      exchangeEventEntity.setPair(ticket.getPair());
      exchangeEventEntity.setDirection(ticket.getDirection().equals(Direction.BUY) ? "B" : "S");
      exchangeEventEntity.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
      exchangeEventEntity.setEventType(ticket.getEventType());
      exchangeEventEntity.setAmount(ticket.getAmount());
      exchangeEventEntity.setRatio(ticket.getRatio());
      exchangeEventEntity.setTicketStatus(UserTicketStatus.ACTIVE);
      exchangeEventEntity.setModifiedDateUtc(ExchangeDateUtils.currentLocalDateTime());
      exchangeEventEntity.setUserId(ticket.getUserId());
      exchangeEventEntity.setAmountRealized(0L);

      exchangeEventEntity = exchangeEventRepository.save(exchangeEventEntity);

      userTicketData.setEventId(exchangeEventEntity.getId());
      exchangeTicketData.setEventId(exchangeEventEntity.getId());
      exchangeEventSourceRepository.saveAll(
          List.of(userTicketData, exchangeTicketData));
      log.info("*** Saved messages '{}'", exchangeEventEntity.toString());
      ticket.setId(exchangeEventEntity.getId());
      sendMessage(ticket);
    }
    if (EventType.CANCEL.equals(ticket.getEventType())) {
      sendMessage(ticket);
    }
  }

  private ExchangeEventSourceEntity getExchangeEventSourceEntity(
      ExchangeEventSourceEntity exchangeEventSourceEntity) {
    ExchangeEventSourceEntity systemEventSourceEntity = new ExchangeEventSourceEntity();
    UUID exchangeAccountId = platformAccountService.getExchangeAccountId(
        exchangeEventSourceEntity.getCurrency());
    systemEventSourceEntity.setUserAccountId(exchangeAccountId);
    systemEventSourceEntity.setDateUtc(exchangeEventSourceEntity.getDateUtc());
    systemEventSourceEntity.setEventType(exchangeEventSourceEntity.getEventType());
    systemEventSourceEntity.setAmount(-exchangeEventSourceEntity.getAmount());
    systemEventSourceEntity.setCreatedBy(exchangeEventSourceEntity.getCreatedBy());
    systemEventSourceEntity.setCreatedDateUtc(exchangeEventSourceEntity.getCreatedDateUtc());
    systemEventSourceEntity.setChecksum(ChecksumUtil.checksum(systemEventSourceEntity));
    systemEventSourceEntity.setCurrency(exchangeEventSourceEntity.getCurrency());
    return systemEventSourceEntity;
  }

  private static ExchangeEventSourceEntity getUserTicketExchangeEventSource(UserTicket ticket) {
    ExchangeEventSourceEntity exchangeEventSourceEntity = new ExchangeEventSourceEntity();

    exchangeEventSourceEntity.setUserAccountId(ticket.getUserAccountId());
    exchangeEventSourceEntity.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
    exchangeEventSourceEntity.setEventType(ticket.getEventType());
    exchangeEventSourceEntity.setAmount(-ticket.getAmount());
    exchangeEventSourceEntity.setCreatedBy(ticket.getUserId());
    exchangeEventSourceEntity.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    exchangeEventSourceEntity.setChecksum(ChecksumUtil.checksum(exchangeEventSourceEntity));
    exchangeEventSourceEntity.setCurrency(
        CurrencyUtils.pairToCurrency(ticket.getPair(), ticket.getDirection()));
    return exchangeEventSourceEntity;
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
