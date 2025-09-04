package org.exchange.app.backend.listeners;

import static org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification.eventId;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.common.config.SystemConfig;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.services.PlatformAccountService;
import org.exchange.app.backend.db.utils.ChecksumUtil;
import org.exchange.app.common.api.model.EventType;
import org.exchange.internal.app.core.strategies.fee.FeeCalculationStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.kafka.annotation.KafkaHandler;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Log4j2
@Service
@KafkaListener(id = "topic-fee-listener",
    topics = {TopicToInternalBackend.FEE_CALCULATION},
    groupId = KafkaConfig.InternalGroups.FEE_CALCULATION,
    autoStartup = KafkaConfig.AUTO_STARTUP_TRUE,
    properties = {
        "key.deserializer=" + Deserializers.STRING,
        "value.deserializer=" + Deserializers.LONG
    },
    concurrency = "1")
public class FeeCalculationListener {

  private final FeeCalculationStrategy feeCalculationStrategy;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final PlatformAccountService platformAccountService;

  @Autowired
  FeeCalculationListener(FeeCalculationStrategy feeCalculationStrategy,
      ExchangeEventSourceRepository exchangeEventSourceRepository,
      PlatformAccountService platformAccountService) {
    this.feeCalculationStrategy = feeCalculationStrategy;
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    this.platformAccountService = platformAccountService;
  }

  @KafkaHandler
  @Transactional(propagation = Propagation.REQUIRES_NEW)
  public void listen(@Payload Long ticketId) {
    log.info("*** Received fee message for ticketId = {}", ticketId);

    try {

      List<ExchangeEventSourceEntity> list = exchangeEventSourceRepository.findAll(
          Specification.allOf(
              eventId(ticketId))
      );
      if (!list.isEmpty()) {
        if (list.stream().anyMatch(e -> EventType.FEE.equals(e.getEventType()))) {
          return;
        }
        long amountSum = list.stream()
            .filter(e ->
                !platformAccountService.exchangeAccountIdsContain(e.getUserAccountId()) &&
                    EventType.EXCHANGE.equals(e.getEventType()))
            .mapToLong(ExchangeEventSourceEntity::getAmount).sum();
        String currency = list.getFirst().getCurrency();
        UUID systemAccountId = platformAccountService.getSystemAccountId(currency);
        long amount = feeCalculationStrategy.calculateFee(amountSum);
        LocalDateTime currentDate = ExchangeDateUtils.currentLocalDateTime();

        ExchangeEventSourceEntity entity = getExchangeEventSourceEntity(
            ticketId, currentDate, -amount, list.getFirst().getUserAccountId(), currency);

        ExchangeEventSourceEntity exchangeEntity = getExchangeEventSourceEntity(
            ticketId, currentDate, amount, systemAccountId, currency);
        exchangeEventSourceRepository.saveAll(List.of(entity, exchangeEntity));
      }
    } catch (Exception e) {
      throw new RuntimeException(
          "Unable to add Fee to ExchangeEventSource table ", e);
    }
  }

  private static ExchangeEventSourceEntity getExchangeEventSourceEntity(Long ticketId,
      LocalDateTime currentDate, long amount, UUID systemAccountId, String currency) {
    ExchangeEventSourceEntity exchangeEntity = new ExchangeEventSourceEntity();
    exchangeEntity.setEventType(EventType.FEE);
    exchangeEntity.setDateUtc(currentDate);
    exchangeEntity.setAmount(amount);
    exchangeEntity.setUserAccountId(systemAccountId);
    exchangeEntity.setCurrency(currency);
    exchangeEntity.setEventId(ticketId);
    exchangeEntity.setCreatedBy(SystemConfig.systemAccountId);
    exchangeEntity.setCreatedDateUtc(currentDate);
    exchangeEntity.setChecksum(ChecksumUtil.checksum(exchangeEntity));
    return exchangeEntity;
  }
}
