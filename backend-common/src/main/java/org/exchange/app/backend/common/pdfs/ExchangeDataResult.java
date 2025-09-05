package org.exchange.app.backend.common.pdfs;

import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import org.exchange.app.common.api.model.Address;
import org.exchange.app.common.api.model.ExchangeEvent;

@Getter
@Setter
public class ExchangeDataResult {

  private ExchangeEvent exchangeEvent;
  private List<ExchangePdfRow> exchangeCoreTicketList = new ArrayList<>();
  private Address systemAddress;
  private Address recipientAddress;
  private Long fee = 0L;
}
