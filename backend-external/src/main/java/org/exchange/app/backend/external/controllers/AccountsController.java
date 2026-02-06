package org.exchange.app.backend.external.controllers;

import java.util.List;
import lombok.AllArgsConstructor;
import org.exchange.app.backend.db.services.WithdrawService;
import org.exchange.app.backend.external.services.AccountsService;
import org.exchange.app.common.api.model.UserAccount;
import org.exchange.app.common.api.model.UserAccountOperation;
import org.exchange.app.common.api.model.UserBankAccount;
import org.exchange.app.common.api.model.UserOperation;
import org.exchange.app.common.api.model.Withdraw;
import org.exchange.app.external.api.AccountsApi;
import org.exchange.app.external.api.model.AccountBalance;
import org.exchange.app.external.api.model.AccountOperationsRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@AllArgsConstructor
public class AccountsController implements AccountsApi {

  private final AccountsService accountsService;
  private final WithdrawService withdrawService;


  @Override
  public ResponseEntity<List<AccountBalance>> loadAccountBalanceList() {
    return ResponseEntity.ok(accountsService.loadAccountBalanceList());
  }

  @Override
  public ResponseEntity<UserAccount> updateUserAccount(UserAccount userAccount) {
    return ResponseEntity.created(null).body(
        accountsService.updateUserAccount(userAccount));
  }

  @Override
  public ResponseEntity<UserAccount> createUserAccount(UserAccount userAccount) {
    return ResponseEntity.created(null).body(
        accountsService.createUserAccount(userAccount));
  }

  @Override
  public ResponseEntity<List<UserOperation>> loadUserOperationList(
      AccountOperationsRequest accountOperationsRequest) {
    return ResponseEntity.ok(accountsService.loadUserOperationList(accountOperationsRequest));
  }

  @Override
  public ResponseEntity<Void> saveWithdrawRequest(UserAccountOperation userAccountOperation) {
    accountsService.saveWithdrawRequest(userAccountOperation);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<UserBankAccount> saveBankAccount(UserBankAccount userBankAccount) {
    UserBankAccount createdAccount = accountsService.saveBankAccount(userBankAccount);
    return ResponseEntity.created(null).body(createdAccount);
  }

  @Override
  public ResponseEntity<List<UserBankAccount>> loadBankAccountList(String currency) {
    return ResponseEntity.ok(accountsService.loadBankAccountList(currency));
  }

  @Override
  public ResponseEntity<List<Withdraw>> loadWithdrawLimitList() {
    return ResponseEntity.ok(withdrawService.loadWithdrawLimitList());
  }
}
