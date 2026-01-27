package org.exchange.app.backend.db.services;

import java.util.List;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.Withdraw;

public interface WithdrawService {

  Long getMinimalAmountForCurrency(Currency currency);

  List<Withdraw> loadWithdrawLimitList();
}
