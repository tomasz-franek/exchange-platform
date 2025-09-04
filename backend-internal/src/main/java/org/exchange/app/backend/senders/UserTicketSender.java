package org.exchange.app.backend.senders;

import org.exchange.app.common.api.model.UserTicket;

public interface UserTicketSender {

  void sendMessage(UserTicket userTicket);
}
