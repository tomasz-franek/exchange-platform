package exchange.data;

import exchange.app.common.api.model.Direction;
import exchange.app.common.api.model.Pair;
import exchange.builders.CoreTicket;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import lombok.Getter;
import lombok.ToString;
import lombok.extern.log4j.Log4j2;

@ToString
@Log4j2
@Getter
public final class SamePriceOrderList {

  private final Pair pair;
  private final long ratio;
  private final Direction direction;
  private List<CoreTicket> orderTickets = new ArrayList<>();

  public SamePriceOrderList(final Pair pair, final Direction direction, final long ratio) {
    this.pair = pair;
    this.ratio = ratio;
    this.direction = direction;
  }

  public void add(final @NotNull CoreTicket ticket) {
    orderTickets.add(ticket);
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
    return orderTickets.removeFirst();
  }

  public boolean removeTicket(final CoreTicket ticket) {
    boolean result = orderTickets.remove(ticket);
    if (result) {
      log.debug("Remove ticket {}", ticket.toString());
    }
    return result;
  }
}
