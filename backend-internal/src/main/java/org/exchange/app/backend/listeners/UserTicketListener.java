package org.exchange.app.backend.listeners;

import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.services.ExchangeEventEntityService;
import org.exchange.app.backend.db.services.ExchangeEventSourceEntityService;
import org.exchange.app.backend.senders.UserTicketSender;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.UserTicket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
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

  private final ExchangeEventRepository exchangeEventRepository;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final UserTicketSender userTicketSender;
  private final ExchangeEventSourceEntityService exchangeEventSourceEntityService;
  private final ExchangeEventEntityService exchangeEventEntityService;

  @Autowired
  public UserTicketListener(ExchangeEventSourceRepository exchangeEventSourceRepository,
      ExchangeEventRepository exchangeEventRepository,
      UserTicketSender userTicketSender,
      ExchangeEventSourceEntityService exchangeEventSourceEntityService,
      ExchangeEventEntityService exchangeEventEntityService
  ) {
    this.exchangeEventRepository = exchangeEventRepository;
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    this.userTicketSender = userTicketSender;
    this.exchangeEventSourceEntityService = exchangeEventSourceEntityService;
    this.exchangeEventEntityService = exchangeEventEntityService;
  }

  @KafkaHandler
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void listen(@Payload UserTicket ticket) {
    log.info("Received messages {}", ticket.toString());
    if (EventType.ORDER.equals(ticket.getEventType())) {
      ExchangeEventSourceEntity userTicketData =
          exchangeEventSourceEntityService.getUserTicketExchangeEventSource(ticket);

      ExchangeEventSourceEntity exchangeTicketData =
          exchangeEventSourceEntityService.getExchangeAccountEventSourceEntity(userTicketData);

      ExchangeEventEntity exchangeEventEntity =
          exchangeEventEntityService.getExchangeEventEntity(ticket);

      exchangeEventEntity = exchangeEventRepository.save(exchangeEventEntity);

      userTicketData.setEventId(exchangeEventEntity.getId());
      exchangeTicketData.setEventId(exchangeEventEntity.getId());
      exchangeEventSourceRepository.saveAll(List.of(userTicketData, exchangeTicketData));
      log.info("*** Saved messages '{}'", exchangeEventEntity.toString());
      ticket.setId(exchangeEventEntity.getId());
      userTicketSender.sendMessage(ticket);
    }
    if (EventType.CANCEL.equals(ticket.getEventType())) {
      userTicketSender.sendMessage(ticket);
    }
  }
}
