package org.exchange.app.backend.external.services;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.common.api.model.UserTicket;
import org.springframework.stereotype.Service;

@Log4j2
@Service
@AllArgsConstructor
public class UserTicketServiceImpl implements UserTicketService {

  private final UserTicketProducer userTicketProducer;

  @Override
  public void saveTicket(UserTicket userTicket) {

    log.info(userTicket);
    try {
      userTicketProducer.sendMessage(userTicket);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
  }

  @Override
  public List<UserTicket> getUserTickets(Long idUser) {
    return List.of();
  }
}
