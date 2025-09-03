package org.exchange.app.backend.listeners;

import static org.exchange.app.backend.common.cache.CacheConfiguration.USER_ACCOUNT_CURRENCY_CACHE;

import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.apache.kafka.common.serialization.LongSerializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.builders.ExchangeResult;
import org.exchange.app.backend.common.cache.CacheConfiguration;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.common.utils.CurrencyUtils;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.common.validators.SystemValidator;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.entities.UserAccountEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.db.services.PlatformAccountService;
import org.exchange.app.backend.db.utils.ChecksumUtil;
import org.exchange.app.backend.db.validators.EntityValidator;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.UserTicketStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.Cache;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
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
        "value.deserializer=" + Deserializers.EXCHANGE_RESULT
    },
    concurrency = "1")
public class ExchangeResultTicketListener {

  private final UserAccountRepository userAccountRepository;
  private final Cache userAccountCurrencyCache;
  private final KafkaTemplate<String, Long> kafkaFeeTemplate;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final PlatformAccountService platformAccountService;

  @Autowired
  ExchangeResultTicketListener(
      @Value("${spring.kafka.bootstrap-servers}") String bootstrapServers,
      UserAccountRepository userAccountRepository,
      ExchangeEventSourceRepository exchangeEventSourceRepository,
      PlatformAccountService platformAccountService) {
    this.userAccountRepository = userAccountRepository;
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    this.platformAccountService = platformAccountService;
    CaffeineCacheManager cacheManager = new CaffeineCacheManager();
    cacheManager.registerCustomCache(CacheConfiguration.USER_ACCOUNT_CURRENCY_CACHE,
        Caffeine.newBuilder().maximumSize(1000).build());
    this.userAccountCurrencyCache = cacheManager.getCache(USER_ACCOUNT_CURRENCY_CACHE);
    this.kafkaFeeTemplate = KafkaConfig.kafkaTemplateProducer(
        TopicToInternalBackend.FEE_CALCULATION, bootstrapServers,
        StringSerializer.class,
        LongSerializer.class);
  }

  public List<ExchangeEventSourceEntity> createExchangeeEventSourceEntity(
      CoreTicket exchangeTicket, CoreTicket reverseExchangeTicket, UUID accountId,
      LocalDateTime epochUTC, EventType eventType, CoreTicket ticketAfterExchange) {

    UUID exchangeAccountId = this.platformAccountService.getExchangeAccountId(
        exchangeTicket.getIdCurrency());
    long amount = exchangeTicket.getAmount();
    String currency = CurrencyUtils.pairToCurrency(exchangeTicket);

    ExchangeEventSourceEntity entity = getExchangeEventSourceEntity(
        exchangeTicket.getId(), accountId, epochUTC, eventType,
        currency, amount, exchangeTicket.getRatio(),
        exchangeAccountId);
    if (reverseExchangeTicket != null) {
      entity.setReverseEventId(reverseExchangeTicket.getId());
      entity.setReverseAmount(reverseExchangeTicket.getAmount());
      entity.setChecksum(ChecksumUtil.checksum(entity));
    }

    ExchangeEventSourceEntity exchangeEntity = getExchangeEventSourceEntity(exchangeTicket.getId(),
        exchangeAccountId, epochUTC, eventType, currency, -amount,
        exchangeTicket.getRatio(), exchangeAccountId);

    if (ticketAfterExchange != null &&
        ticketAfterExchange.isFinishOrder() &&
        ticketAfterExchange.getAmount() > 0) {

      ExchangeEventSourceEntity leftOverExchange = getExchangeEventSourceEntity(
          exchangeTicket.getId(), exchangeAccountId, epochUTC, eventType,
          currency, ticketAfterExchange.getAmount(),
          exchangeTicket.getRatio(), exchangeAccountId);

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
  public void listen(@Payload ExchangeResult exchangeResult) {
    log.info("*** Received exchange result {}", exchangeResult);
    List<ExchangeEventSourceEntity> exchangeEventSourceEntityList = createExchangeEventSourceEntityList(
        exchangeResult);
    if (!exchangeEventSourceEntityList.isEmpty()) {
      exchangeEventSourceRepository.saveAll(exchangeEventSourceEntityList);
    }
    sendFeeCalculation(exchangeResult);
  }

  private void sendFeeCalculation(ExchangeResult exchangeResult) {
    if (exchangeResult.getBuyTicketAfterExchange() != null
        && exchangeResult.getBuyTicketAfterExchange().isFinishOrder()) {
      this.kafkaFeeTemplate.send(TopicToInternalBackend.FEE_CALCULATION,
          exchangeResult.getBuyTicket().getId());
    }
    if (exchangeResult.getSellTicketAfterExchange() != null
        && exchangeResult.getSellTicketAfterExchange().isFinishOrder()) {
      this.kafkaFeeTemplate.send(TopicToInternalBackend.FEE_CALCULATION,
          exchangeResult.getSellTicket().getId());
    }
    if (exchangeResult.getCancelledTicket() != null &&
        UserTicketStatus.PARTIAL_CANCELED.equals(exchangeResult.getUserTicketStatus())) {
      this.kafkaFeeTemplate.send(TopicToInternalBackend.FEE_CALCULATION,
          exchangeResult.getCancelledTicket().getId());
    }
  }

  List<ExchangeEventSourceEntity> createExchangeEventSourceEntityList(
      ExchangeResult exchangeResult) {
    List<ExchangeEventSourceEntity> exchangeEventSourceEntityList = new ArrayList<>();

    getUserAccount(exchangeResult.getBuyExchange()).ifPresent(buyAccount ->
        exchangeEventSourceEntityList.addAll(
            createExchangeeEventSourceEntity(
                exchangeResult.getBuyExchange(),
                exchangeResult.getSellExchange(),
                buyAccount.getId(),
                exchangeResult.getExchangeEpochUTC(),
                EventType.EXCHANGE,
                exchangeResult.getSellTicket()
            )
        )
    );
    getUserAccount(exchangeResult.getSellExchange()).ifPresent(sellAccount ->
        exchangeEventSourceEntityList.addAll(
            createExchangeeEventSourceEntity(
                exchangeResult.getSellExchange(),
                exchangeResult.getBuyExchange(),
                sellAccount.getId(),
                exchangeResult.getExchangeEpochUTC(),
                EventType.EXCHANGE,
                exchangeResult.getBuyTicket()
            )
        )
    );
    getUserAccount(exchangeResult.getCancelledTicket()).ifPresent(cancelAccount ->
        exchangeEventSourceEntityList.addAll(
            createExchangeeEventSourceEntity(
                exchangeResult.getCancelledTicket(),
                null,
                cancelAccount.getId(),
                exchangeResult.getExchangeEpochUTC(),
                EventType.CANCEL,
                null)));
    return exchangeEventSourceEntityList;
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
