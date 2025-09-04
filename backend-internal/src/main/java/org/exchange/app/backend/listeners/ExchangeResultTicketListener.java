package org.exchange.app.backend.listeners;

import java.util.ArrayList;
import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.builders.ExchangeResult;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.db.caches.UserAccountCache;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.services.ExchangeEventSourceEntityService;
import org.exchange.app.backend.senders.FeeCalculationSender;
import org.exchange.app.common.api.model.EventType;
import org.springframework.beans.factory.annotation.Autowired;
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
        "value.deserializer=" + Deserializers.EXCHANGE_RESULT
    },
    concurrency = "1")
public class ExchangeResultTicketListener {


  private final FeeCalculationSender feeCalculationSender;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final UserAccountCache userAccountCache;
  private final ExchangeEventSourceEntityService exchangeEventSourceEntityService;

  @Autowired
  ExchangeResultTicketListener(
      FeeCalculationSender feeCalculationSender,
      ExchangeEventSourceRepository exchangeEventSourceRepository,
      ExchangeEventSourceEntityService exchangeEventSourceEntityService,
      UserAccountCache userAccountCache) {
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    this.userAccountCache = userAccountCache;
    this.exchangeEventSourceEntityService = exchangeEventSourceEntityService;
    this.feeCalculationSender = feeCalculationSender;
  }

  @KafkaHandler
  public void listen(@Payload ExchangeResult exchangeResult) {
    log.info("*** Received exchange result {}", exchangeResult);
    List<ExchangeEventSourceEntity> exchangeEventSourceEntityList = createExchangeEventSourceEntityList(
        exchangeResult);
    if (!exchangeEventSourceEntityList.isEmpty()) {
      exchangeEventSourceRepository.saveAll(exchangeEventSourceEntityList);
    }
    feeCalculationSender.sendFeeCalculation(exchangeResult);
  }

  List<ExchangeEventSourceEntity> createExchangeEventSourceEntityList(
      ExchangeResult exchangeResult) {
    List<ExchangeEventSourceEntity> exchangeEventSourceEntityList = new ArrayList<>();

    userAccountCache.getUserAccount(exchangeResult.getBuyExchange()).ifPresent(buyAccount ->
        exchangeEventSourceEntityList.addAll(
            exchangeEventSourceEntityService.createExchangeEventSourceEntities(
                exchangeResult.getBuyExchange(),
                exchangeResult.getSellExchange(),
                buyAccount.getId(),
                exchangeResult.getExchangeEpochUTC(),
                EventType.EXCHANGE,
                exchangeResult.getSellTicket()
            )
        )
    );
    userAccountCache.getUserAccount(exchangeResult.getSellExchange()).ifPresent(sellAccount ->
        exchangeEventSourceEntityList.addAll(
            exchangeEventSourceEntityService.createExchangeEventSourceEntities(
                exchangeResult.getSellExchange(),
                exchangeResult.getBuyExchange(),
                sellAccount.getId(),
                exchangeResult.getExchangeEpochUTC(),
                EventType.EXCHANGE,
                exchangeResult.getBuyTicket()
            )
        )
    );
    userAccountCache.getUserAccount(exchangeResult.getCancelledTicket()).ifPresent(cancelAccount ->
        exchangeEventSourceEntityList.addAll(
            exchangeEventSourceEntityService.createExchangeEventSourceEntities(
                exchangeResult.getCancelledTicket(),
                null,
                cancelAccount.getId(),
                exchangeResult.getExchangeEpochUTC(),
                EventType.CANCEL,
                null)));
    return exchangeEventSourceEntityList;
  }
}
