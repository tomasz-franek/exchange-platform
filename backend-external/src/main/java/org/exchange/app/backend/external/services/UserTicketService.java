package org.exchange.app.backend.external.services;


import java.util.List;
import org.exchange.app.common.api.model.KafkaOrderTicket;
import org.exchange.app.external.api.model.UserTicket;

public interface UserTicketService {

  void saveTicket(Long idUser, KafkaOrderTicket userTicket);

  List<UserTicket> getUserTickets(Long idUser);
}
