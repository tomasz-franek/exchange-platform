package org.exchange.app.backend.senders;

import org.exchange.app.backend.common.builders.ExchangeResult;

public interface ExchangeResultSender {

  void sendExchangeResult(ExchangeResult exchangeResult);
}
