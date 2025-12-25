package org.exchange.app.backend.admin.services;

import java.util.List;
import org.exchange.app.admin.api.model.AccountOperationsRequest;
import org.exchange.app.admin.api.model.AccountsReportRequest;
import org.exchange.app.admin.api.model.AccountsReportResponse;
import org.exchange.app.admin.api.model.PairPeriodResponse;
import org.exchange.app.admin.api.model.TransactionsPdfRequest;
import org.exchange.app.common.api.model.Pair;

public interface AdminReportsService {

  List<AccountsReportResponse> generateAccountsReport(AccountsReportRequest accountsReportRequest);

  byte[] loadOperationPdfDocument(AccountOperationsRequest pdfDocumentRequest);

  byte[] loadTransactionsPdfDocument(TransactionsPdfRequest transactionsPdfRequest);

  PairPeriodResponse loadPairPeriodReport(Pair pair, Integer period);
}
