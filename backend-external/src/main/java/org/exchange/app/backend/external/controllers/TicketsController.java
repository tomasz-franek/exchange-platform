package org.exchange.app.backend.external.controllers;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.exchange.app.backend.external.services.TicketsService;
import org.exchange.app.common.api.model.UserTicket;
import org.exchange.app.external.api.TicketsApi;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequiredArgsConstructor
public class TicketsController implements TicketsApi {

  private final TicketsService ticketsService;

  @Override
  public ResponseEntity<List<UserTicket>> loadUserTicketList() {
    return ResponseEntity.ok(ticketsService.loadUserTicketList());
  }

  @Override
  public ResponseEntity<Void> saveUserTicket(UserTicket userTicket) {
    ticketsService.saveUserTicket(userTicket);
    return ResponseEntity.noContent().build();
  }
}
