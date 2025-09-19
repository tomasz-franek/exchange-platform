package org.exchange.app.backend.admin.services;

import java.util.List;
import org.exchange.app.common.api.model.SystemCurrency;


public interface AdminPropertiesService {

  void updateSystemCurrency(SystemCurrency systemCurrency);

  List<SystemCurrency> loadSystemCurrencyList();
  
}
