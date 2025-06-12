package org.exchange.app.backend.listeners;

import static org.exchange.app.backend.common.cache.CacheConfiguration.USER_ACCOUNT_CURRENCY_CACHE;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.cache.CacheConfiguration;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.EventType;
import org.exchange.internal.app.core.builders.CoreTicket;
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

  @Autowired
  ExchangeResultTicketListener(ObjectMapper objectMapper,
      UserAccountRepository userAccountRepository,
      ExchangeEventSourceRepository exchangeEventSourceRepository) {
    this.objectMapper = objectMapper;
    this.userAccountRepository = userAccountRepository;
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    CaffeineCacheManager cacheManager = new CaffeineCacheManager();
    cacheManager.registerCustomCache(CacheConfiguration.USER_ACCOUNT_CURRENCY_CACHE,
        Caffeine.newBuilder().maximumSize(1000).build());
    this.userAccountCurrencyCache = cacheManager.getCache(USER_ACCOUNT_CURRENCY_CACHE);
  }

  private static ExchangeEventSourceEntity createExchangeeEventSourceEntity(
      CoreTicket coreTicket, UserAccountEntity account, Long epochUTC) {
    ExchangeEventSourceEntity buyEntity = new ExchangeEventSourceEntity();
    buyEntity.setAmount(coreTicket.getAmount());
    buyEntity.setEventType(EventType.EXCHANGE);
    buyEntity.setDateUtc(Timestamp.valueOf(
        LocalDateTime.ofInstant(Instant.ofEpochMilli(epochUTC), ZoneOffset.UTC)));
    buyEntity.setUserAccountId(account.getId());
    return buyEntity;
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

  private void saveExchangeResult(ExchangeResult exchangeResult) {
    UserAccountEntity buyAccount = getUserAccount(exchangeResult.getBuyExchange());
    UserAccountEntity sellAccount = getUserAccount(exchangeResult.getSellExchange());

    exchangeEventSourceRepository.saveAll(
        List.of(
            createExchangeeEventSourceEntity(exchangeResult.getBuyExchange(), buyAccount,
                exchangeResult.getExchangeEpochUTC()),
            createExchangeeEventSourceEntity(exchangeResult.getSellExchange(), sellAccount,
                exchangeResult.getExchangeEpochUTC())
        )
    );

  }

  private UserAccountEntity getUserAccount(CoreTicket coreTicket) {
    return userAccountCurrencyCache.get(coreTicket.getUserId() + coreTicket.getIdCurrency(),
        () -> userAccountRepository.findByUserIdAndCurrency(
            coreTicket.getUserId(),
            Currency.valueOf(coreTicket.getIdCurrency())).orElse(null));
  }
}
