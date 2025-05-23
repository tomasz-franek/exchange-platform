package org.exchange.app.backend.external.controllers;

import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.exchange.app.backend.external.services.AccountsService;
import org.exchange.app.common.api.model.UserAccount;
import org.exchange.app.external.api.AccountsApi;
import org.exchange.app.external.api.model.AccountBalance;
import org.exchange.app.external.api.model.UserAccountOperation;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class AccountsController implements AccountsApi {

  private final AccountsService accountsService;

  @Override
  public ResponseEntity<Void> addWithdrawRequest(
      UserAccountOperation userAccountOperation) {
    accountsService.addWithdrawRequest(userAccountOperation);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<Void> addAccountDeposit(
      UserAccountOperation userAccountOperation) {
    accountsService.addAccountDeposit(userAccountOperation);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<List<AccountBalance>> getUserAccountList(UUID userId) {
    return ResponseEntity.ok(accountsService.getUserAccountList(userId));
  }

  @Override
  public ResponseEntity<UserAccount> updateUserAccount(UUID accountId, UserAccount userAccount) {
    return ResponseEntity.created(null).body(
        accountsService.updateUserAccount(accountId, userAccount));
  }

  @Override
  public ResponseEntity<UserAccount> createUserAccount(UserAccount userAccount) {
    return ResponseEntity.created(null).body(
        accountsService.createUserAccount(userAccount));
  }
}
