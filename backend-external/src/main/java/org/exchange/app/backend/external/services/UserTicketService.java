package org.exchange.app.backend.external.services;


import java.util.List;
import org.exchange.app.common.api.model.UserTicket;

public interface UserTicketService {

  void saveTicket(UserTicket userTicket);

  List<UserTicket> getUserTickets(Long idUser);
}
