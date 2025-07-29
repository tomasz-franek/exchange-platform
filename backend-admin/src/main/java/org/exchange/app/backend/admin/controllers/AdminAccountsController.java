package org.exchange.app.backend.admin.controllers;

import java.util.List;
import org.exchange.app.admin.api.AccountsApi;
import org.exchange.app.admin.api.model.UserAccountRequest;
import org.exchange.app.backend.admin.services.AdminAccountsService;
import org.exchange.app.common.api.model.UserAccount;
import org.exchange.app.common.api.model.UserAccountOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4100")
@RestController
public class AdminAccountsController implements AccountsApi {

  private final AdminAccountsService adminAccountsService;

  @Autowired
  public AdminAccountsController(AdminAccountsService adminAccountsService) {
    this.adminAccountsService = adminAccountsService;
  }

  @Override
  public ResponseEntity<List<UserAccount>> loadAccounts(UserAccountRequest userAccountRequest) {
    return ResponseEntity.ok(adminAccountsService.loadAccounts(userAccountRequest));
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
}
