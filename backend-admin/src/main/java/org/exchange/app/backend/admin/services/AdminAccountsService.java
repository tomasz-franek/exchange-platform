package org.exchange.app.backend.admin.services;

import java.util.List;
import org.exchange.app.admin.api.model.SystemAccountOperation;
import org.exchange.app.admin.api.model.SystemAccountOperationsRequest;
import org.exchange.app.admin.api.model.UserAccountRequest;
import org.exchange.app.common.api.model.UserAccount;
import org.exchange.app.common.api.model.UserAccountOperation;

public interface AdminAccountsService {

  List<UserAccount> loadAccounts(UserAccountRequest userAccountRequest);

  void saveAccountDeposit(UserAccountOperation userAccountOperation);

  void saveWithdrawRequest(UserAccountOperation userAccountOperation);

  List<UserAccount> loadSystemAccountList();

  List<SystemAccountOperation> loadSystemAccountOperationList(
      SystemAccountOperationsRequest systemAccountOperationsRequest);
}
