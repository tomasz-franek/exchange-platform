package org.exchange.app.backend.db.services;

import org.exchange.app.common.api.model.Currency;

public interface WithdrawService {

  Long getMinimalAmountForCurrency(Currency currency);
}
