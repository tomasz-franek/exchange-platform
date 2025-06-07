package org.exchange.app.backend.external.services;

import java.util.List;
import java.util.UUID;
import org.exchange.app.common.api.model.UserAccount;
import org.exchange.app.common.api.model.UserOperation;
import org.exchange.app.external.api.model.AccountBalance;
import org.exchange.app.external.api.model.AccountOperationsRequest;
import org.exchange.app.external.api.model.UserAccountOperation;
import org.exchange.app.external.api.model.UserProperty;

public interface AccountsService {

  void saveAccountDeposit(UserAccountOperation userAccountOperation);

  void saveWithdrawRequest(UserAccountOperation userAccountOperation);

  List<AccountBalance> loadAccountBalanceList();

  UserAccount updateUserAccount(UUID id, UserAccount userAccount);

  UserAccount createUserAccount(UserAccount userAccount);

  List<UserOperation> loadUserOperationList(
      AccountOperationsRequest accountOperationsRequest);

  UserProperty getUserPropertyById(UUID userId);

  void saveUserProperty(UUID userId, UserProperty userProperty);

  void updateUserProperty(UUID userId, UserProperty userProperty);
}
