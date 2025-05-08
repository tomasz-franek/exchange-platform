package org.exchange.app.backend.external.services;


import exchange.app.external.api.model.UserTicket;
import java.util.List;

public interface UserTicketService {

  void saveTicket(Long idUser, UserTicket userTicket);

  List<UserTicket> getUserTickets(Long idUser);
}
