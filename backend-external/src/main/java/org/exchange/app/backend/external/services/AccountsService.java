package org.exchange.app.backend.external.services;

import org.exchange.app.external.api.model.UserAccountOperation;

public interface AccountsService {

  void addAccountDeposit(UserAccountOperation userAccountOperation);

  void addWithdrawRequest(UserAccountOperation userAccountOperation);
}
