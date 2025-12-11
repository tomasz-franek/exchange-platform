package org.exchange.app.backend.admin.controllers;

import java.util.List;
import org.exchange.app.admin.api.ReportsApi;
import org.exchange.app.admin.api.model.AccountOperationsRequest;
import org.exchange.app.admin.api.model.AccountsReportRequest;
import org.exchange.app.admin.api.model.AccountsReportResponse;
import org.exchange.app.admin.api.model.TransactionsPdfRequest;
import org.exchange.app.backend.admin.services.AdminReportsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminReportsController implements ReportsApi {

  private final AdminReportsService adminReportsService;

  @Autowired
  public AdminReportsController(AdminReportsService adminReportsService) {
    this.adminReportsService = adminReportsService;
  }

  @Override
  public ResponseEntity<List<AccountsReportResponse>> generateAccountsReport(
      AccountsReportRequest accountsReportRequest) {
    return ResponseEntity.ok(adminReportsService.generateAccountsReport(accountsReportRequest));
  }

  @Override
  public ResponseEntity<Resource> loadOperationPdfDocument(
      AccountOperationsRequest accountOperationsRequest) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_PDF);
    headers.add("Content-Disposition", "attachment; file=systemOperationsReport.pdf");
    return ResponseEntity
        .ok()
        .headers(headers)
        .contentType(new MediaType("application", "pdf"))
        .body(new ByteArrayResource(
            adminReportsService.loadOperationPdfDocument(accountOperationsRequest)));
  }

  @Override
  public ResponseEntity<Resource> loadTransactionsPdfDocument(
      TransactionsPdfRequest transactionsPdfRequest) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_PDF);
    headers.add("Content-Disposition", "attachment; file=currencyTransactionReport.pdf");
    return ResponseEntity
        .ok()
        .headers(headers)
        .contentType(new MediaType("application", "pdf"))
        .body(new ByteArrayResource(
            adminReportsService.loadTransactionsPdfDocument(transactionsPdfRequest)));
  }


}
