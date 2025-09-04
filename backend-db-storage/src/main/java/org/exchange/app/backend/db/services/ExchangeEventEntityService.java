package org.exchange.app.backend.db.services;

import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.common.api.model.UserTicket;

public interface ExchangeEventEntityService {

  ExchangeEventEntity getExchangeEventEntity(UserTicket ticket);
}
