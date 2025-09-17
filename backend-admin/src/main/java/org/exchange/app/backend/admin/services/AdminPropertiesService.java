package org.exchange.app.backend.admin.services;

import org.exchange.app.common.api.model.SystemCurrency;


public interface AdminPropertiesService {

  void updateSystemCurrency(SystemCurrency systemCurrency);
}
