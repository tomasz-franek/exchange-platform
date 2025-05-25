package org.exchange.app.backend.common.ws;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderBookData {

  private String type;
  private String message;
}
