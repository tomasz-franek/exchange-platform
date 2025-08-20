package org.exchange.app.backend.external.services;

import org.exchange.app.external.api.model.FinancialReportRequest;

public interface ReportsService {

  byte[] loadExchangePdfDocument(Long ticketId);

  byte[] loadFinancialReportPdfDocument(FinancialReportRequest request);
}
