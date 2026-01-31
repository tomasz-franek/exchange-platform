package org.exchange.app.backend.admin.services;

import java.util.List;
import org.exchange.app.common.api.model.SystemCurrency;
import org.exchange.app.common.api.model.Withdraw;


public interface AdminPropertiesService {

  void updateSystemCurrency(SystemCurrency systemCurrency);

  List<SystemCurrency> loadSystemCurrencyList();

  void saveWithdrawLimit(Withdraw withdraw);

  void updateWithdrawLimit(Withdraw withdraw);
}
