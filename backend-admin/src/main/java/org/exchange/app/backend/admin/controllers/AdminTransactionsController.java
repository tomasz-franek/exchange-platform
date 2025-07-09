package org.exchange.app.backend.admin.controllers;

import java.util.List;
import org.exchange.app.admin.api.TransactionsApi;
import org.exchange.app.admin.api.model.SelectTransactionRequest;
import org.exchange.app.admin.api.model.Transaction;
import org.exchange.app.backend.admin.services.AdminTransactionsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4100")
@RestController
public class AdminTransactionsController implements TransactionsApi {

  private final AdminTransactionsService adminTransactionsService;

  @Autowired
  public AdminTransactionsController(AdminTransactionsService adminTransactionsService) {
    this.adminTransactionsService = adminTransactionsService;
  }

  @Override
  public ResponseEntity<List<Transaction>> selectTransactions(
      SelectTransactionRequest selectTransactionRequest) {
    return ResponseEntity.ok(adminTransactionsService.selectTransactions(selectTransactionRequest));
  }
}
