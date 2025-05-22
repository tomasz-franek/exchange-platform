package org.exchange.app.backend.external.controllers;

import lombok.AllArgsConstructor;
import org.exchange.app.backend.external.services.AccountsService;
import org.exchange.app.external.api.AccountsApi;
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
}
