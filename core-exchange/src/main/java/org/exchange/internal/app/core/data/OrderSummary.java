package org.exchange.internal.app.core.data;


import static org.exchange.app.common.api.model.Direction.BUY;

import jakarta.validation.constraints.NotNull;
import java.util.List;
import lombok.Getter;
import org.exchange.app.internal.api.model.ExchangeTicket;
import org.exchange.app.internal.api.model.OrderTicket;

@Getter
public class OrderSummary {

  private final OrderTicket orderTicket;
  private final List<ExchangeTicket> exchangeTicketList;

  public OrderSummary(final @NotNull OrderTicket orderTicket,
      final @NotNull List<ExchangeTicket> exchangeTicketList) {
    this.orderTicket = orderTicket;
    this.exchangeTicketList = exchangeTicketList;
  }

  public final boolean validateOrderSummary() {
    long sumExchange = 0L;

    if (this.exchangeTicketList.isEmpty()) {
      return false;
    }

    for (ExchangeTicket ticket : this.exchangeTicketList) {
      sumExchange = sumExchange + ticket.getAmount();
    }
    if (sumExchange < 0) {
      return false;
    }

    if (BUY.equals(orderTicket.getDirection())) {
      return
          this.orderTicket.getRatio() * orderTicket.getAmount() >= sumExchange;
    } else {
      return this.orderTicket.getAmount() * this.orderTicket.getRatio() >= sumExchange;
    }
  }
}
