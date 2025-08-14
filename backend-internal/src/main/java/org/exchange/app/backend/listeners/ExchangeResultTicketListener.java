package org.exchange.app.backend.listeners;

import static org.exchange.app.backend.common.cache.CacheConfiguration.USER_ACCOUNT_CURRENCY_CACHE;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.cache.CacheConfiguration;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.common.validators.SystemValidator;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.db.utils.ChecksumUtil;
import org.exchange.app.backend.db.validators.EntityValidator;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.EventType;
import org.exchange.internal.app.core.data.ExchangeResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@KafkaListener(id = "topic-exchange-result-listener",
    topics = TopicToInternalBackend.EXCHANGE_RESULT,
    groupId = KafkaConfig.InternalGroups.EXCHANGE_RESULT,
    autoStartup = KafkaConfig.AUTO_STARTUP_TRUE,
    properties = {
        "key.deserializer=" + Deserializers.STRING,
        "value.deserializer=" + Deserializers.STRING
    },
    concurrency = "1")
public class ExchangeResultTicketListener {

  private final ObjectMapper objectMapper;
  private final UserAccountRepository userAccountRepository;
  private final Cache userAccountCurrencyCache;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final ExchangeEventRepository exchangeEventRepository;

  @Autowired
  ExchangeResultTicketListener(ObjectMapper objectMapper,
      UserAccountRepository userAccountRepository,
      ExchangeEventSourceRepository exchangeEventSourceRepository,
      ExchangeEventRepository exchangeEventRepository) {
    this.objectMapper = objectMapper;
    this.userAccountRepository = userAccountRepository;
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    this.exchangeEventRepository = exchangeEventRepository;
    CaffeineCacheManager cacheManager = new CaffeineCacheManager();
    cacheManager.registerCustomCache(CacheConfiguration.USER_ACCOUNT_CURRENCY_CACHE,
        Caffeine.newBuilder().maximumSize(1000).build());
    this.userAccountCurrencyCache = cacheManager.getCache(USER_ACCOUNT_CURRENCY_CACHE);
  }

  private static ExchangeEventSourceEntity createExchangeeEventSourceEntity(
      CoreTicket exchangeTicket, CoreTicket reverseExchangeTicket, UserAccountEntity account,
      LocalDateTime epochUTC, EventType eventType) {
    ExchangeEventSourceEntity entity = new ExchangeEventSourceEntity();
    entity.setAmount(exchangeTicket.getAmount());
    entity.setEventType(eventType);
    entity.setDateUtc(epochUTC);
    entity.setUserAccountId(account.getId());
    entity.setEventId(exchangeTicket.getId());
    entity.setCurrency(exchangeTicket.getIdCurrency());
    if (reverseExchangeTicket != null) {
      entity.setReverseEventId(reverseExchangeTicket.getId());
      entity.setReverseAmount(reverseExchangeTicket.getAmount());
    }
    entity.setRatio(exchangeTicket.getRatio());

    SystemValidator.validate(
            EntityValidator.haveCorrectFieldTextValues(entity),
            EntityValidator.haveNotNullValues(entity))
        .throwValidationExceptionWhenErrors();
    entity.setChecksum(ChecksumUtil.checksum(entity));
    return entity;
  }

  @KafkaHandler
  public void listen(@Payload String payload) {
    log.info("*** Received exchange result {}", payload);
    try {
      ExchangeResult exchangeResult = objectMapper.readValue(payload, ExchangeResult.class);
      saveExchangeResult(exchangeResult);
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }
  }

  void saveExchangeResult(ExchangeResult exchangeResult) {
    List<ExchangeEventSourceEntity> exchangeEventSourceEntityList = new ArrayList<>();

    getUserAccount(exchangeResult.getBuyExchange()).ifPresent(buyAccount ->
        exchangeEventSourceEntityList.add(
            createExchangeeEventSourceEntity(
                exchangeResult.getBuyExchange(),
                exchangeResult.getSellExchange(),
                buyAccount,
                exchangeResult.getExchangeEpochUTC(),
                EventType.EXCHANGE
            )
        )
    );
    getUserAccount(exchangeResult.getSellExchange()).ifPresent(sellAccount ->
        exchangeEventSourceEntityList.add(
            createExchangeeEventSourceEntity(
                exchangeResult.getSellExchange(),
                exchangeResult.getBuyExchange(),
                sellAccount,
                exchangeResult.getExchangeEpochUTC(),
                EventType.EXCHANGE
            )
        )
    );
    getUserAccount(exchangeResult.getCancelledTicket()).ifPresent(cancelAccount -> {

      exchangeEventSourceEntityList.add(
          createExchangeeEventSourceEntity(
              exchangeResult.getCancelledTicket(),
              null,
              cancelAccount,
              exchangeResult.getExchangeEpochUTC(),
              EventType.CANCEL));
      exchangeEventRepository.deleteById(exchangeResult.getCancelledTicket().getId());
    });

    if (!exchangeEventSourceEntityList.isEmpty()) {
      exchangeEventSourceRepository.saveAll(exchangeEventSourceEntityList);
    }
  }

  private Optional<UserAccountEntity> getUserAccount(CoreTicket coreTicket) {
    if (coreTicket == null) {
      return Optional.empty();
    }
    return userAccountCurrencyCache.get(coreTicket.getUserId() + coreTicket.getIdCurrency(),
        () -> userAccountRepository.findByUserIdAndCurrency(
            coreTicket.getUserId(),
            Currency.valueOf(coreTicket.getIdCurrency())));
  }
}
