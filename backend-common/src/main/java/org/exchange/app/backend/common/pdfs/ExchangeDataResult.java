package org.exchange.app.backend.common.pdfs;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.exchange.app.backend.common.builders.CoreTicket;
import org.exchange.app.common.api.model.Address;

@Getter
@Setter
public class ExchangeDataResult {

  private CoreTicket sourceTicket;
  private List<ExchangeResult> exchangeCoreTicketList = new ArrayList<>();
  private Address systemAddress;
  private Address recipientAddress;
  private Long fee;
}
