package org.exchange.app.backend.external.services;

import java.util.List;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.external.api.model.UserTicket;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class UserTicketServiceImpl implements UserTicketService {

  @Override
  public void saveTicket(Long idUser, UserTicket userTicket) {
    log.info(userTicket);
  }

  @Override
  public List<UserTicket> getUserTickets(Long idUser) {
    return List.of();
  }
}
