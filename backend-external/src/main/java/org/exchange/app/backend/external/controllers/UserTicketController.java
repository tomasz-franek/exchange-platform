package org.exchange.app.backend.external.controllers;

import exchange.app.external.api.TicketsApi;
import exchange.app.external.api.model.UserTicket;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.exchange.app.backend.external.services.UserTicketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class UserTicketController implements TicketsApi {

  private final UserTicketService userTicketService;

  @Override
  public ResponseEntity<List<UserTicket>> getUserTickets(Long idUser) {
    return ResponseEntity.ok(userTicketService.getUserTickets(idUser));
  }

  @Override
  public ResponseEntity<Void> saveTicket(Long idUser, UserTicket userTicket) {
    userTicketService.saveTicket(idUser, userTicket);
    return ResponseEntity.noContent().build();
  }
}
