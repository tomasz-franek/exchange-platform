package org.exchange.app.backend.external.services;


import java.util.List;
import org.exchange.app.common.api.model.PagedSortedTimeRangeRequest;
import org.exchange.app.common.api.model.UserTicket;
import org.exchange.app.external.api.model.RealizedTicketPage;

public interface TicketsService {

  void saveUserTicket(UserTicket userTicket);

  List<UserTicket> loadUserTicketList();

  void cancelExchangeTicket(UserTicket userTicket);

  RealizedTicketPage loadRealizedTicketList(PagedSortedTimeRangeRequest request);
}
