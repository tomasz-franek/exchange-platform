package org.exchange.app.backend.listeners;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.external.api.model.UserAccountOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@KafkaListener(id = "topic-user-account-listener",
    topics = {KafkaConfig.EXTERNAL_ACCOUNT_TOPIC},
    groupId = KafkaConfig.EXTERNAL_ACCOUNT_GROUP,
    autoStartup = "${listen.auto.start:true}",
    properties = {
        "value.deserializer=" + KafkaConfig.USER_ACCOUNT_OPERATION_DESERIALIZER
    },
    concurrency = "1")
public class UserAccountOperationListener {

  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final UserAccountRepository userAccountRepository;


  @Autowired
  public UserAccountOperationListener(
      ExchangeEventSourceRepository exchangeEventSourceRepository,
      UserAccountRepository userAccountRepository) {
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    this.userAccountRepository = userAccountRepository;
  }

  @KafkaHandler
  public void listen(@Payload UserAccountOperation userAccountOperation,
      @Header(KafkaHeaders.RECEIVED_KEY) String key) {
    log.info("*** Received user account operation messages {}", userAccountOperation.toString());
    try {
      userAccountRepository.findByUserIdAndCurrency(
              userAccountOperation.getIdUser(),
              userAccountOperation.getCurrency())
          .ifPresent(
              userAccountEntity -> {
                ExchangeEventSourceEntity exchangeEventSourceEntity = new ExchangeEventSourceEntity();
                exchangeEventSourceEntity.setUserAccountId(userAccountEntity.getId());
                exchangeEventSourceEntity.setValue(userAccountOperation.getValue());
                exchangeEventSourceEntity.setDateUTC(LocalDateTime.now(ZoneOffset.UTC));
                exchangeEventSourceEntity.setEventType(key.substring(0, 2));
                exchangeEventSourceRepository.save(exchangeEventSourceEntity);
              }
          );

    } catch (Exception e) {
      throw new RuntimeException(
          "Unable to add Core Ticket to exchange controller ", e);
    }
  }
}
