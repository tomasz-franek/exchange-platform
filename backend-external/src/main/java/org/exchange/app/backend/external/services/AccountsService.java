package org.exchange.app.backend.external.services;

import java.util.List;
import java.util.UUID;
import org.exchange.app.external.api.model.AccountBalance;
import org.exchange.app.external.api.model.UserAccountOperation;

public interface AccountsService {

  void addAccountDeposit(UserAccountOperation userAccountOperation);

  void addWithdrawRequest(UserAccountOperation userAccountOperation);

  List<AccountBalance> getUserAccountList(UUID userId);
}
