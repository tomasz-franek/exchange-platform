package org.exchange.app.backend.db.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.UserTicket;

public interface ExchangeEventSourceEntityService {

  List<ExchangeEventSourceEntity> createExchangeEventSourceEntities(
      CoreTicket exchangeTicket, CoreTicket reverseExchangeTicket, UUID accountId,
      LocalDateTime epochUTC, EventType eventType, CoreTicket ticketAfterExchange);

  ExchangeEventSourceEntity getUserTicketExchangeEventSource(UserTicket ticket);

  ExchangeEventSourceEntity getExchangeAccountEventSourceEntity(
      ExchangeEventSourceEntity exchangeEventSourceEntity);
}
