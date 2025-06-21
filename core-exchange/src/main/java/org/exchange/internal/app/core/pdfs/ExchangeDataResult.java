package org.exchange.internal.app.core.pdfs;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.exchange.internal.app.core.builders.CoreTicket;

@Getter
@Setter
public class ExchangeDataResult {

  private CoreTicket sourceTicket;
  private List<CoreTicket> exchangeCoreTicketList = new ArrayList<>();
}
