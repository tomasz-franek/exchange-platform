package org.exchange.app.backend.admin.controllers;

import org.exchange.app.admin.api.ReportsApi;
import org.exchange.app.admin.api.model.AccountsReportRequest;
import org.exchange.app.admin.api.model.AccountsReportResponse;
import org.exchange.app.backend.admin.services.AdminReportsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4100")
@RestController
public class AdminReportsController implements ReportsApi {

  private final AdminReportsService adminReportsService;

  @Autowired
  public AdminReportsController(AdminReportsService adminReportsService) {
    this.adminReportsService = adminReportsService;
  }

  @Override
  public ResponseEntity<AccountsReportResponse> generateAccountsReport(
      AccountsReportRequest accountsReportRequest) {
    adminReportsService.generateAccountsReport(accountsReportRequest);
    return ResponseEntity.ok().build();
  }
}
