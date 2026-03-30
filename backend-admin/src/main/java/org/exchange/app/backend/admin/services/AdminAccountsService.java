package org.exchange.app.backend.admin.services;

import java.util.List;
import java.util.UUID;
import org.exchange.app.admin.api.model.AccountAmountRequest;
import org.exchange.app.admin.api.model.AccountAmountResponse;
import org.exchange.app.admin.api.model.AccountOperation;
import org.exchange.app.admin.api.model.AccountOperationsReportRequest;
import org.exchange.app.admin.api.model.AdminAccountOperationsPage;
import org.exchange.app.admin.api.model.AdminAccountOperationsRequest;
import org.exchange.app.admin.api.model.TransactionsPdfRequest;
import org.exchange.app.admin.api.model.UserAccountRequest;
import org.exchange.app.admin.api.model.UserBankAccountRequest;
import org.exchange.app.common.api.model.UserAccount;
import org.exchange.app.common.api.model.UserAccountOperation;
import org.exchange.app.common.api.model.UserBankAccount;

public interface AdminAccountsService {

  List<UserAccount> loadAccounts(UserAccountRequest userAccountRequest);

  void saveAccountDeposit(UserAccountOperation userAccountOperation);

  void saveWithdrawRequest(UserAccountOperation userAccountOperation);

  List<UserAccount> loadAccountList(UUID userId);

  AdminAccountOperationsPage loadAdminAccountOperationList(
      AdminAccountOperationsRequest accountOperationsRequest);

  List<AccountOperation> loadReportAccountOperationList(
      AccountOperationsReportRequest accountOperationsRequest);

  List<UUID> loadUserAccountIds(UUID userId);

  AccountAmountResponse loadAccountAmount(AccountAmountRequest amountRequest);

  List<UserBankAccount> loadBankAccountList(UserBankAccountRequest userBankAccountRequest);

  void validateBankAccount(UserBankAccount userBankAccount);

  List<AccountOperation> loadTransactionList(TransactionsPdfRequest transactionsPdfRequest);
}
