package org.exchange.app.backend.external.services;


import java.util.List;
import org.exchange.app.external.api.model.UserTicket;

public interface UserTicketService {

  void saveTicket(Long idUser, UserTicket userTicket);

  List<UserTicket> getUserTickets(Long idUser);
}
