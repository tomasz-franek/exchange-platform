package org.exchange.app.backend.admin.controllers;

import java.util.List;
import org.exchange.app.admin.api.AccountsApi;
import org.exchange.app.admin.api.model.UserAccountRequest;
import org.exchange.app.common.api.model.UserAccount;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4100")
@RestController
public class AdminAccountsController implements AccountsApi {

  @Override
  public ResponseEntity<List<UserAccount>> loadAccounts(UserAccountRequest userAccountRequest) {
    return AccountsApi.super.loadAccounts(userAccountRequest);
  }
}
