package org.exchange.app.backend.common.pdfs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExchangeResult {

  private Long buyAmount;
  private Long sellAmount;
  private Long ratio;
}
