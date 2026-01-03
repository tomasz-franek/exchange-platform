package org.exchange.app.backend.listeners;

import java.time.LocalDateTime;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.common.config.KafkaConfig.InternalGroups;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.db.utils.ChecksumUtil;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.UserAccountOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@KafkaListener(id = "cash_transaction-listener",
    topics = TopicToInternalBackend.CASH_TRANSACTION,
    groupId = InternalGroups.CASH_TRANSACTION,
    autoStartup = KafkaConfig.AUTO_STARTUP_TRUE,
    properties = {
        "key.deserializer=" + Deserializers.STRING,
        "value.deserializer=" + Deserializers.USER_ACCOUNT_OPERATION
    },
    concurrency = "1")
public class CashTransactionListener {

  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final UserAccountRepository userAccountRepository;

  @Autowired
  CashTransactionListener(
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers,
      ExchangeEventSourceRepository exchangeEventSourceRepository,
      UserAccountRepository userAccountRepository) {
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    this.userAccountRepository = userAccountRepository;
  }

  @KafkaHandler
  public void listen(@Header(KafkaHeaders.RECEIVED_KEY) String key,
      @Payload UserAccountOperation operation) {
    log.info("*** Received cash transaction {}", operation.toString());
    try {
      if (userAccountRepository.existsUserIdAndUserAccountId(operation.getUserId(),
          operation.getUserAccountId()).isPresent()) {
        ExchangeEventSourceEntity exchangeEventSourceEntity = new ExchangeEventSourceEntity();
        exchangeEventSourceEntity.setUserAccountId(operation.getUserAccountId());
        exchangeEventSourceEntity.setAmount(operation.getAmount());
        exchangeEventSourceEntity.setEventType(EventType.fromValue(key));
        exchangeEventSourceEntity.setDateUtc(LocalDateTime.now());
        exchangeEventSourceEntity.setCreatedDateUtc(LocalDateTime.now());
        exchangeEventSourceEntity.setChecksum(ChecksumUtil.checksum(exchangeEventSourceEntity));
        exchangeEventSourceEntity.setCurrency(operation.getCurrency().getValue());
        exchangeEventSourceEntity.setCreatedBy(operation.getUserId());
        exchangeEventSourceRepository.save(exchangeEventSourceEntity);
      }
    } catch (Exception e) {
      throw new RuntimeException(
          "Unable to save cash transaction ", e);
    }
  }
}
