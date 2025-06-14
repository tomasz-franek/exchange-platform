package org.exchange.app.backend.listeners;

import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.EventType;
import org.exchange.internal.app.core.strategies.fee.FeeCalculationStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@KafkaListener(id = "topic-fee-listener",
    topics = {TopicToInternalBackend.FEE_CALCULATION},
    groupId = KafkaConfig.InternalGroups.FEE_CALCULATION,
    autoStartup = KafkaConfig.AUTO_STARTUP_TRUE,
    properties = {
        "key.deserializer=" + Deserializers.STRING,
        "value.deserializer=" + Deserializers.STRING
    },
    concurrency = "1")
public class FeeCalculationListener {

  private final FeeCalculationStrategy feeCalculationStrategy;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final UserAccountRepository userAccountRepository;

  @Autowired
  FeeCalculationListener(FeeCalculationStrategy feeCalculationStrategy,
      ExchangeEventSourceRepository exchangeEventSourceRepository,
      UserAccountRepository userAccountRepository) {
    this.feeCalculationStrategy = feeCalculationStrategy;
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    this.userAccountRepository = userAccountRepository;
  }

  @KafkaHandler
  public void listen(@Payload String request) {
    log.info("*** Received fee messages {}", request);
    String[] data = request.split(":");
    try {
      UserAccountEntity userAccountEntity = userAccountRepository.findByUserIdAndCurrency(
          UUID.fromString(data[0]),
          Currency.valueOf(data[1])).orElse(null);
      if (userAccountEntity != null) {
        ExchangeEventSourceEntity entity = new ExchangeEventSourceEntity();
        entity.setEventType(EventType.FEE);
        entity.setDateUtc(ExchangeDateUtils.currentTimestamp());
        entity.setAmount(feeCalculationStrategy.calculateFee(Long.parseLong(data[2])));
        entity.setUserAccountId(userAccountEntity.getId());
        exchangeEventSourceRepository.save(entity);
      }
    } catch (Exception e) {
      throw new RuntimeException(
          "Unable to add Fee to ExchangeEventSource table ", e);
    }
  }
}
