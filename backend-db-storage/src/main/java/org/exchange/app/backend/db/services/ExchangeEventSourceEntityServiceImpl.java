package org.exchange.app.backend.db.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.common.utils.CurrencyUtils;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.common.validators.SystemValidator;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.utils.ChecksumUtil;
import org.exchange.app.backend.db.validators.EntityValidator;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.UserTicket;
import org.springframework.stereotype.Service;

@Service
public class ExchangeEventSourceEntityServiceImpl implements ExchangeEventSourceEntityService {

  private final PlatformAccountService platformAccountService;

  public ExchangeEventSourceEntityServiceImpl(PlatformAccountService platformAccountService) {
    this.platformAccountService = platformAccountService;
  }

  public List<ExchangeEventSourceEntity> createExchangeEventSourceEntities(
      CoreTicket exchangeTicket, CoreTicket reverseExchangeTicket, UUID accountId,
      LocalDateTime epochUTC, EventType eventType, CoreTicket ticketAfterExchange) {

    UUID exchangeAccountId = platformAccountService.getExchangeAccountId(
        exchangeTicket.getIdCurrency());
    long amount = exchangeTicket.getAmount();
    String currency = CurrencyUtils.pairToCurrency(exchangeTicket);

    ExchangeEventSourceEntity entity = createEntity(exchangeTicket.getId(), accountId, epochUTC,
        eventType, currency, amount, exchangeTicket.getRatio(), exchangeAccountId);
    if (reverseExchangeTicket != null) {
      entity.setReverseEventId(reverseExchangeTicket.getId());
      entity.setReverseAmount(reverseExchangeTicket.getAmount());
      entity.setChecksum(ChecksumUtil.checksum(entity));
    }

    ExchangeEventSourceEntity exchangeEntity = createEntity(exchangeTicket.getId(),
        exchangeAccountId, epochUTC, eventType, currency, -amount, exchangeTicket.getRatio(),
        exchangeAccountId);

    if (ticketAfterExchange != null && ticketAfterExchange.isFinishOrder()
        && ticketAfterExchange.getAmount() > 0) {
      ExchangeEventSourceEntity leftOverExchange = createEntity(exchangeTicket.getId(),
          exchangeAccountId, epochUTC, eventType, currency, ticketAfterExchange.getAmount(),
          exchangeTicket.getRatio(), exchangeAccountId);
      return List.of(entity, exchangeEntity, leftOverExchange);
    } else {
      return List.of(entity, exchangeEntity);
    }
  }

  @Override
  public ExchangeEventSourceEntity getUserTicketExchangeEventSource(UserTicket ticket) {
    ExchangeEventSourceEntity exchangeEventSourceEntity = new ExchangeEventSourceEntity();

    exchangeEventSourceEntity.setUserAccountId(ticket.getUserAccountId());
    exchangeEventSourceEntity.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
    exchangeEventSourceEntity.setEventType(ticket.getEventType());
    exchangeEventSourceEntity.setAmount(-ticket.getAmount());
    exchangeEventSourceEntity.setCreatedBy(ticket.getUserId());
    exchangeEventSourceEntity.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    exchangeEventSourceEntity.setChecksum(ChecksumUtil.checksum(exchangeEventSourceEntity));
    exchangeEventSourceEntity.setCurrency(
        CurrencyUtils.pairToCurrency(ticket.getPair(), ticket.getDirection()));
    return exchangeEventSourceEntity;
  }

  @Override
  public ExchangeEventSourceEntity getExchangeAccountEventSourceEntity(
      ExchangeEventSourceEntity exchangeEventSourceEntity) {
    ExchangeEventSourceEntity systemEventSourceEntity = new ExchangeEventSourceEntity();
    UUID exchangeAccountId = platformAccountService.getExchangeAccountId(
        exchangeEventSourceEntity.getCurrency());
    systemEventSourceEntity.setUserAccountId(exchangeAccountId);
    systemEventSourceEntity.setDateUtc(exchangeEventSourceEntity.getDateUtc());
    systemEventSourceEntity.setEventType(exchangeEventSourceEntity.getEventType());
    systemEventSourceEntity.setAmount(-exchangeEventSourceEntity.getAmount());
    systemEventSourceEntity.setCreatedBy(exchangeEventSourceEntity.getCreatedBy());
    systemEventSourceEntity.setCreatedDateUtc(exchangeEventSourceEntity.getCreatedDateUtc());
    systemEventSourceEntity.setChecksum(ChecksumUtil.checksum(systemEventSourceEntity));
    systemEventSourceEntity.setCurrency(exchangeEventSourceEntity.getCurrency());
    return systemEventSourceEntity;
  }

  private ExchangeEventSourceEntity createEntity(Long eventId, UUID accountId,
      LocalDateTime epochUTC, EventType eventType, String currency, Long amount,
      Long ratio, UUID createdAccountId) {
    ExchangeEventSourceEntity entity = new ExchangeEventSourceEntity();
    entity.setEventType(eventType);
    entity.setDateUtc(epochUTC);
    entity.setUserAccountId(accountId);
    entity.setEventId(eventId);
    entity.setCurrency(currency);
    entity.setRatio(ratio);
    entity.setCreatedBy(createdAccountId);
    entity.setCreatedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    entity.setAmount(amount);
    validate(entity);
    entity.setChecksum(ChecksumUtil.checksum(entity));
    return entity;
  }

  private void validate(ExchangeEventSourceEntity exchangeEventSourceEntity) {
    SystemValidator.validate(
            EntityValidator.haveCorrectFieldTextValues(exchangeEventSourceEntity),
            EntityValidator.haveNotNullValues(exchangeEventSourceEntity))
        .throwValidationExceptionWhenErrors();
  }
}
