package org.exchange.app.backend.external.services;


import java.util.List;
import org.exchange.app.common.api.model.UserTicket;

public interface TicketsService {

  void saveUserTicket(UserTicket userTicket);

  List<UserTicket> loadUserTicketList();

  void cancelExchangeTicket(UserTicket userTicket);
}
