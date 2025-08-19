package org.exchange.app.backend.admin.services;

import org.exchange.app.admin.api.model.AccountsReportRequest;
import org.exchange.app.admin.api.model.AccountsReportResponse;
import org.exchange.app.admin.api.model.SystemAccountOperationsRequest;

public interface AdminReportsService {

  AccountsReportResponse generateAccountsReport(AccountsReportRequest accountsReportRequest);

  byte[] loadSystemOperationPdfDocument(SystemAccountOperationsRequest pdfDocumentRequest);
}
