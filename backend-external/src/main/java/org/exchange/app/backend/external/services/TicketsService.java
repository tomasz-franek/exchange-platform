package org.exchange.app.backend.external.services;


import org.exchange.app.common.api.model.PagedSortedTimeRangeRequest;
import org.exchange.app.common.api.model.UserTicket;
import org.exchange.app.external.api.model.UserTicketPage;

public interface TicketsService {

  void saveUserTicket(UserTicket userTicket);

  UserTicketPage loadUserTicketList(PagedSortedTimeRangeRequest request);

  void cancelExchangeTicket(UserTicket userTicket);

  UserTicketPage loadRealizedTicketList(PagedSortedTimeRangeRequest request);
}
