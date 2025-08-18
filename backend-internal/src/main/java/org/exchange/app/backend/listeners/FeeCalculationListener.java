package org.exchange.app.backend.listeners;

import static org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification.eventId;
import static org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification.eventType;
import static org.springframework.util.StringUtils.hasText;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.config.KafkaConfig;
import org.exchange.app.backend.common.config.KafkaConfig.Deserializers;
import org.exchange.app.backend.common.config.KafkaConfig.TopicToInternalBackend;
import org.exchange.app.backend.common.config.SystemConfig;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.db.utils.ChecksumUtil;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.EventType;
import org.exchange.internal.app.core.strategies.fee.FeeCalculationStrategy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
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
  private final ObjectMapper objectMapper = new ObjectMapper();

  @Autowired
  FeeCalculationListener(FeeCalculationStrategy feeCalculationStrategy,
      ExchangeEventSourceRepository exchangeEventSourceRepository,
      UserAccountRepository userAccountRepository) {
    this.feeCalculationStrategy = feeCalculationStrategy;
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    this.userAccountRepository = userAccountRepository;
  }

  @KafkaHandler
  public void listen(@Payload String ticket) {
    log.info("*** Received fee messages {}", ticket);
    if (!hasText(ticket)) {
      return;
    }
    Long ticketId = Long.valueOf(ticket);

    try {

      List<ExchangeEventSourceEntity> list = exchangeEventSourceRepository.findAll(
          Specification.allOf(
              eventId(ticketId),
              eventType(EventType.EXCHANGE))
      );
      if (!list.isEmpty()) {
        long amountSum = list.stream().mapToLong(ExchangeEventSourceEntity::getAmount).sum();
        String currency = list.getFirst().getCurrency();
        UUID systemAccountId = getSystemAccount(currency);

        ExchangeEventSourceEntity entity = new ExchangeEventSourceEntity();
        entity.setEventType(EventType.FEE);
        entity.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
        entity.setAmount(feeCalculationStrategy.calculateFee(amountSum));
        entity.setUserAccountId(systemAccountId);
        entity.setCurrency(currency);
        entity.setEventId(ticketId);
        entity.setChecksum(ChecksumUtil.checksum(entity));
        exchangeEventSourceRepository.save(entity);
      }
    } catch (Exception e) {
      throw new RuntimeException(
          "Unable to add Fee to ExchangeEventSource table ", e);
    }
  }

  private UUID getSystemAccount(String currency) {
    return userAccountRepository.findByUserIdAndCurrency(SystemConfig.systemUserId,
            Currency.fromValue(currency))
        .orElseThrow(
            () -> new ObjectWithIdNotFoundException("System account", currency)
        ).getId();
  }
}
