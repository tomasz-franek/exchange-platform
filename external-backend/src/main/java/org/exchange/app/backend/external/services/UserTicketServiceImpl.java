package org.exchange.app.backend.external.services;

import exchange.app.external.api.model.UserTicket;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class UserTicketServiceImpl implements UserTicketService {

  @Override
  public void saveTicket(Long idUser, UserTicket userTicket) {

  }

  @Override
  public List<UserTicket> getUserTickets(Long idUser) {
    return List.of();
  }
}
