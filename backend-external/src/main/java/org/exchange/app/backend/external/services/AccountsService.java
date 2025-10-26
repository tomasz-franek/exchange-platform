package org.exchange.app.backend.external.services;

import java.util.List;
import org.exchange.app.common.api.model.UserAccount;
import org.exchange.app.common.api.model.UserAccountOperation;
import org.exchange.app.common.api.model.UserBankAccount;
import org.exchange.app.common.api.model.UserOperation;
import org.exchange.app.external.api.model.AccountBalance;
import org.exchange.app.external.api.model.AccountOperationsRequest;

public interface AccountsService {


  List<AccountBalance> loadAccountBalanceList();

  UserAccount updateUserAccount(UserAccount userAccount);

  UserAccount createUserAccount(UserAccount userAccount);

  List<UserOperation> loadUserOperationList(
      AccountOperationsRequest accountOperationsRequest);

  void saveWithdrawRequest(UserAccountOperation userAccountOperation);

  UserBankAccount saveBankAccount(UserBankAccount userBankAccount);
}
