package org.exchange.app.backend.admin.controllers;

import java.util.List;
import lombok.AllArgsConstructor;
import org.exchange.app.admin.api.AccountsApi;
import org.exchange.app.admin.api.model.AccountAmountRequest;
import org.exchange.app.admin.api.model.AccountAmountResponse;
import org.exchange.app.admin.api.model.AccountOperation;
import org.exchange.app.admin.api.model.AccountOperationsRequest;
import org.exchange.app.admin.api.model.UserAccountRequest;
import org.exchange.app.admin.api.model.UserBankAccountRequest;
import org.exchange.app.backend.admin.services.AdminAccountsService;
import org.exchange.app.backend.common.config.SystemConfig;
import org.exchange.app.backend.db.services.WithdrawService;
import org.exchange.app.common.api.model.UserAccount;
import org.exchange.app.common.api.model.UserAccountOperation;
import org.exchange.app.common.api.model.UserBankAccount;
import org.exchange.app.common.api.model.Withdraw;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class AdminAccountsController implements AccountsApi {

  private final AdminAccountsService adminAccountsService;
  private final WithdrawService withdrawService;

  @Override
  public ResponseEntity<List<UserAccount>> loadAccounts(UserAccountRequest userAccountRequest) {
    return ResponseEntity.ok(adminAccountsService.loadAccounts(userAccountRequest));
  }

  @Override
  public ResponseEntity<List<UserAccount>> loadSystemAccountList() {
    return ResponseEntity.ok(adminAccountsService.loadAccountList(SystemConfig.systemAccountId));
  }

  @Override
  public ResponseEntity<List<UserAccount>> loadExchangeAccountList() {
    return ResponseEntity.ok(adminAccountsService.loadAccountList(SystemConfig.exchangeAccountId));
  }


  @Override
  public ResponseEntity<Void> saveWithdrawRequest(
      UserAccountOperation userAccountOperation) {
    adminAccountsService.saveWithdrawRequest(userAccountOperation);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<Void> saveAccountDeposit(
      UserAccountOperation userAccountOperation) {
    adminAccountsService.saveAccountDeposit(userAccountOperation);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<List<AccountOperation>> loadAccountOperationList(
      AccountOperationsRequest accountOperationsRequest) {
    return ResponseEntity.ok(
        adminAccountsService.loadAccountOperationList(accountOperationsRequest));
  }

  @Override
  public ResponseEntity<AccountAmountResponse> loadAccountAmount(
      AccountAmountRequest accountOperationsRequest) {
    return ResponseEntity.ok(
        adminAccountsService.loadAccountAmount(accountOperationsRequest));
  }

  @Override
  public ResponseEntity<List<UserBankAccount>> loadBankAccountList(
      UserBankAccountRequest userBankAccountRequest) {
    return ResponseEntity.ok(
        adminAccountsService.loadBankAccountList(userBankAccountRequest));
  }

  @Override
  public ResponseEntity<Void> validateBankAccount(UserBankAccount userBankAccount) {
    adminAccountsService.validateBankAccount(userBankAccount);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<List<Withdraw>> loadWithdrawLimitList() {
    return ResponseEntity.ok(withdrawService.loadWithdrawLimitList());
  }
}
