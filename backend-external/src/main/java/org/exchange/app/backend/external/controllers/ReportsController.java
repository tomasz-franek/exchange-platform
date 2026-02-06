package org.exchange.app.backend.external.controllers;

import org.exchange.app.backend.external.services.ReportsService;
import org.exchange.app.external.api.ReportsApi;
import org.exchange.app.external.api.model.FinancialReportRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

@Controller
public class ReportsController implements ReportsApi {

  private final ReportsService reportsService;

  @Autowired
  public ReportsController(ReportsService reportsService) {
    this.reportsService = reportsService;
  }

  @Override
  public ResponseEntity<Resource> loadExchangePdfDocument(Long ticketId) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_PDF);
    headers.add("Content-Disposition",
        String.format("attachment; file=exchangeReport-%s.pdf", ticketId));
    return ResponseEntity
        .ok()
        .headers(headers)
        .contentType(new MediaType("application", "pdf"))
        .body(new ByteArrayResource(reportsService.loadExchangePdfDocument(ticketId)));
  }

  @Override
  public ResponseEntity<Resource> loadFinancialReportPdfDocument(FinancialReportRequest request) {
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_PDF);
    headers.add("Content-Disposition",
        String.format("attachment; file=financialReport-%d-%d.pdf", request.getYear(),
            request.getMonth()));
    return ResponseEntity
        .ok()
        .headers(headers)
        .contentType(new MediaType("application", "pdf"))
        .body(new ByteArrayResource(reportsService.loadFinancialReportPdfDocument(request)));
  }
}
