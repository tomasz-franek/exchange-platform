package org.exchange.app.backend.external.services;


import java.util.List;
import java.util.UUID;
import org.exchange.app.common.api.model.UserTicket;

public interface TicketsService {

  void saveTicket(UserTicket userTicket);

  List<UserTicket> loadUserTicketList(UUID userId);
}
