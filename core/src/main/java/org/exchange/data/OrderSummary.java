package org.exchange.data;


import static org.exchange.app.common.api.model.Direction.BUY;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
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
    BigDecimal sumExchange = BigDecimal.ZERO;

    if (this.exchangeTicketList.isEmpty()) {
      return false;
    }

    for (ExchangeTicket ticket : this.exchangeTicketList) {
      sumExchange = sumExchange.add(ticket.getValueAmount());
    }
    if (sumExchange.compareTo(BigDecimal.ZERO) < 0) {
      return false;
    }

    if (BUY.equals(orderTicket.getDirection())) {
      return
          this.orderTicket.getRatio().multiply(orderTicket.getValueAmount()).compareTo(sumExchange)
              >= 0;
    } else {
      return this.orderTicket.getValueAmount().multiply(this.orderTicket.getRatio())
          .compareTo(sumExchange) >= 0;
    }
  }
}
