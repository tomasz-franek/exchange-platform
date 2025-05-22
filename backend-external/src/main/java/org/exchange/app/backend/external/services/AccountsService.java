package org.exchange.app.backend.external.services;

import org.exchange.app.external.api.model.UserAccountOperationRequest;

public interface AccountsService {

  void addAccountDeposit(UserAccountOperationRequest userAccountOperationRequest);

  void addWithdrawRequest(UserAccountOperationRequest userAccountOperationRequest);
}
