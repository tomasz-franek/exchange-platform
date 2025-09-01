package org.exchange.app.backend.listeners;

import static org.exchange.app.backend.common.cache.CacheConfiguration.USER_ACCOUNT_CURRENCY_CACHE;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.cache.CacheConfiguration;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.common.validators.SystemValidator;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.db.services.PlatformAccountService;
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
  private final PlatformAccountService platformAccountService;

  @Autowired
  ExchangeResultTicketListener(ObjectMapper objectMapper,
      UserAccountRepository userAccountRepository,
      ExchangeEventSourceRepository exchangeEventSourceRepository,
      ExchangeEventRepository exchangeEventRepository,
      PlatformAccountService platformAccountService) {
    this.objectMapper = objectMapper;
    this.userAccountRepository = userAccountRepository;
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    this.exchangeEventRepository = exchangeEventRepository;
    this.platformAccountService = platformAccountService;
    CaffeineCacheManager cacheManager = new CaffeineCacheManager();
    cacheManager.registerCustomCache(CacheConfiguration.USER_ACCOUNT_CURRENCY_CACHE,
        Caffeine.newBuilder().maximumSize(1000).build());
    this.userAccountCurrencyCache = cacheManager.getCache(USER_ACCOUNT_CURRENCY_CACHE);
  }

  public List<ExchangeEventSourceEntity> createExchangeeEventSourceEntity(
      CoreTicket exchangeTicket, CoreTicket reverseExchangeTicket, UserAccountEntity account,
      LocalDateTime epochUTC, EventType eventType, CoreTicket ticketAfterExchange) {

    UUID systemAccountId = this.platformAccountService.getSystemAccountId(
        exchangeTicket.getIdCurrency());
    UUID exchangeAccountId = this.platformAccountService.getExchangeAccountId(
        exchangeTicket.getIdCurrency());

    ExchangeEventSourceEntity entity = getExchangeEventSourceEntity(
        exchangeTicket.getId(), account.getId(), epochUTC, eventType,
        exchangeTicket.getIdCurrency(), exchangeTicket.getAmount(), exchangeTicket.getRatio(),
        systemAccountId);
    if (reverseExchangeTicket != null) {
      entity.setReverseEventId(reverseExchangeTicket.getId());
      entity.setReverseAmount(reverseExchangeTicket.getAmount());
    }

    long amount = exchangeTicket.getAmount();
    if (ticketAfterExchange != null &&
        ticketAfterExchange.getAmount() > 0 &&
        ticketAfterExchange.isFinishOrder()
    ) {
      amount += ticketAfterExchange.getAmount();
    }
    ExchangeEventSourceEntity exchangeEntity = getExchangeEventSourceEntity(exchangeTicket.getId(),
        exchangeAccountId, epochUTC, eventType, exchangeTicket.getIdCurrency(), -amount,
        exchangeTicket.getRatio(), exchangeAccountId);

    if (ticketAfterExchange != null &&
        ticketAfterExchange.isFinishOrder() &&
        ticketAfterExchange.getAmount() > 0) {

      ExchangeEventSourceEntity leftOverExchange = getExchangeEventSourceEntity(
          exchangeTicket.getId(), systemAccountId, epochUTC, eventType,
          exchangeTicket.getIdCurrency(), ticketAfterExchange.getAmount(),
          exchangeTicket.getRatio(), systemAccountId);

      return List.of(entity, exchangeEntity, leftOverExchange);
    } else {
      return List.of(entity, exchangeEntity);
    }
  }

  private static ExchangeEventSourceEntity getExchangeEventSourceEntity(Long eventId,
      UUID accountId, LocalDateTime epochUTC, EventType eventType, String currency, Long amount,
      Long ratio, UUID createdAccountId) {
    ExchangeEventSourceEntity entity = new ExchangeEventSourceEntity();
    entity.setEventType(eventType);
    entity.setDateUtc(epochUTC);
    entity.setUserAccountId(accountId);
    entity.setEventId(eventId);
    entity.setCurrency(currency);
    entity.setCreatedBy(createdAccountId);
    entity.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    entity.setAmount(amount);
    entity.setRatio(ratio);
    validate(entity);
    entity.setChecksum(ChecksumUtil.checksum(entity));
    return entity;
  }

  private static void validate(ExchangeEventSourceEntity leftOverExchange) {
    SystemValidator.validate(
            EntityValidator.haveCorrectFieldTextValues(leftOverExchange),
            EntityValidator.haveNotNullValues(leftOverExchange))
        .throwValidationExceptionWhenErrors();
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
        exchangeEventSourceEntityList.addAll(
            createExchangeeEventSourceEntity(
                exchangeResult.getBuyExchange(),
                exchangeResult.getSellExchange(),
                buyAccount,
                exchangeResult.getExchangeEpochUTC(),
                EventType.EXCHANGE,
                exchangeResult.getBuyTicketAfterExchange()
            )
        )
    );
    getUserAccount(exchangeResult.getSellExchange()).ifPresent(sellAccount ->
        exchangeEventSourceEntityList.addAll(
            createExchangeeEventSourceEntity(
                exchangeResult.getSellExchange(),
                exchangeResult.getBuyExchange(),
                sellAccount,
                exchangeResult.getExchangeEpochUTC(),
                EventType.EXCHANGE,
                exchangeResult.getSellTicketAfterExchange()
            )
        )
    );
    getUserAccount(exchangeResult.getCancelledTicket()).ifPresent(cancelAccount -> {

      exchangeEventSourceEntityList.addAll(
          createExchangeeEventSourceEntity(
              exchangeResult.getCancelledTicket(),
              null,
              cancelAccount,
              exchangeResult.getExchangeEpochUTC(),
              EventType.CANCEL,
              null));
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
