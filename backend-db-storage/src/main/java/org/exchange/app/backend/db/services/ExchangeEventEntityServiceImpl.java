package org.exchange.app.backend.db.services;

import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.UserTicket;
import org.exchange.app.common.api.model.UserTicketStatus;
import org.springframework.stereotype.Service;

@Service
public class ExchangeEventEntityServiceImpl implements ExchangeEventEntityService {

  @Override
  public ExchangeEventEntity getExchangeEventEntity(UserTicket ticket) {
    ExchangeEventEntity exchangeEventEntity = new ExchangeEventEntity();

    exchangeEventEntity.setUserAccountId(ticket.getUserAccountId());
    exchangeEventEntity.setPair(ticket.getPair());
    exchangeEventEntity.setDirection(ticket.getDirection().equals(Direction.BUY) ? "B" : "S");
    exchangeEventEntity.setDateUtc(ExchangeDateUtils.currentLocalDateTime());
    exchangeEventEntity.setEventType(ticket.getEventType());
    exchangeEventEntity.setAmount(ticket.getAmount());
    exchangeEventEntity.setRatio(ticket.getRatio());
    exchangeEventEntity.setTicketStatus(UserTicketStatus.ACTIVE);
    exchangeEventEntity.setModifiedDateUtc(ExchangeDateUtils.currentLocalDateTime());
    exchangeEventEntity.setUserId(ticket.getUserId());
    exchangeEventEntity.setAmountRealized(0L);
    return exchangeEventEntity;
  }
}
