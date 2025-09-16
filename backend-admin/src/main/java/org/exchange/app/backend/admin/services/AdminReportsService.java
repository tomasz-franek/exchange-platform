package org.exchange.app.backend.admin.services;

import java.util.List;
import org.exchange.app.admin.api.model.AccountOperationsRequest;
import org.exchange.app.admin.api.model.AccountsReportRequest;
import org.exchange.app.admin.api.model.AccountsReportResponse;

public interface AdminReportsService {

  List<AccountsReportResponse> generateAccountsReport(AccountsReportRequest accountsReportRequest);

  byte[] loadOperationPdfDocument(AccountOperationsRequest pdfDocumentRequest);
}
