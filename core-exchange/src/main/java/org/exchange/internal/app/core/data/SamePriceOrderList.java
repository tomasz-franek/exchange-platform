package org.exchange.internal.app.core.data;

import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.common.api.model.Direction;
import org.exchange.app.common.api.model.Pair;
import org.exchange.internal.app.core.builders.CoreTicket;

@ToString
@Log4j2
@Getter
public final class SamePriceOrderList {

  private final Pair pair;
  private final long ratio;
  private final Direction direction;
  private List<CoreTicket> orderTickets = new ArrayList<>();
  private final AtomicLong sumAmount = new AtomicLong(0);

  public SamePriceOrderList(final Pair pair, final Direction direction, final long ratio) {
    this.pair = pair;
    this.ratio = ratio;
    this.direction = direction;
  }

  public void add(final @NotNull CoreTicket ticket) {

    orderTickets.add(ticket);
    sumAmount.addAndGet(ticket.getAmount());
  }

  public List<CoreTicket> getList() {
    return orderTickets;
  }

  public void addList(final List<CoreTicket> ticketList) {
    for (CoreTicket ticket : ticketList) {
      add(ticket);
    }
    this.orderTickets.sort(Comparator.comparing(CoreTicket::getId));
  }

  public int size() {
    return orderTickets.size();
  }

  public CoreTicket removeFirst() {

    CoreTicket coreTicket = orderTickets.removeFirst();
    this.sumAmount.addAndGet(-coreTicket.getAmount());
    return coreTicket;
  }

  public boolean removeTicket(final CoreTicket ticket) {
    boolean result = orderTickets.remove(ticket);
    if (result) {
      log.debug("Remove ticket {}", ticket.toString());
    }
    sumAmount.addAndGet(-ticket.getAmount());
    return result;
  }

  public String getRateAndAmount() {
    return String.format("{\"rate\":%d,\"amount\":%d},", this.ratio,
        this.sumAmount.get());
  }
}
