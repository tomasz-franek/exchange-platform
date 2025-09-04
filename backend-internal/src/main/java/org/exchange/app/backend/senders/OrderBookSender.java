package org.exchange.app.backend.senders;

import java.util.List;
import org.exchange.app.common.api.model.OrderBookData;

public interface OrderBookSender {

  void sendOrderBookData(List<OrderBookData> orderBookData);

  void sendOrderBookData(OrderBookData orderBookData);
}
