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

  private final InputRecordProducer inputRecordProducer;

  @Override
  public void saveTicket(UserTicket userTicket) {

    log.info(userTicket);
    inputRecordProducer.sendMessage(userTicket, userTicket.getPair());
  }

  @Override
  public List<UserTicket> getUserTickets(Long idUser) {
    return List.of();
  }
}
