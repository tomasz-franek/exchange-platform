package org.exchange.app.backend.listeners;

import java.util.Optional;
import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.backend.db.mappers.UserAccountMapper;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.common.api.model.UserAccount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@KafkaListener(id = "topic-user-account-listener",
    topics = {KafkaConfig.ExternalTopics.ACCOUNT_LIST},
    groupId = KafkaConfig.InternalGroups.ACCOUNT_LIST,
    autoStartup = KafkaConfig.AUTO_STARTUP_TRUE,
    properties = {
        "key.deserializer=" + Deserializers.PAIR,
        "value.deserializer=" + Deserializers.USER_ACCOUNT_OPERATION
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
  @SendTo
  public UserAccount listen(@Payload UserAccount userAccount,
      @Header(KafkaHeaders.RECEIVED_KEY) String key) {
    log.info("*** Received user account operation messages {}", userAccount.toString());
    try {
      Optional<UserAccountEntity> userAccountEntity = userAccountRepository.findByUserIdAndCurrency(
          UUID.fromString(key), userAccount.getCurrency());
      return userAccountEntity.map(UserAccountMapper.INSTANCE::toDto).orElse(null);
    } catch (Exception e) {
      throw new RuntimeException(
          "Unable to add Core Ticket to exchange controller ", e);
    }

  }
}
