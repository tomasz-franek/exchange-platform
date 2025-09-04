package org.exchange.app.backend.senders;

import org.exchange.app.backend.common.builders.ExchangeResult;

public interface FeeCalculationSender {

  void sendFeeCalculation(ExchangeResult exchangeResult);
}
