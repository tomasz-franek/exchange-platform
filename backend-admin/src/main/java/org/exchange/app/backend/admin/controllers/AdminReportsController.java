package org.exchange.app.backend.admin.controllers;

import lombok.AllArgsConstructor;
import org.exchange.app.admin.api.ReportsApi;
import org.exchange.app.admin.api.model.AccountsReportRequest;
import org.exchange.app.backend.admin.services.AdminReportsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4100")
@RestController
@AllArgsConstructor
public class AdminReportsController implements ReportsApi {

  AdminReportsService adminReportsService;

  @Override
  public ResponseEntity<Void> generateAccountsReport(AccountsReportRequest accountsReportRequest) {
    adminReportsService.generateAccountsReport(accountsReportRequest);
    return ResponseEntity.ok().build();
  }
}
