package org.exchange.app.backend.admin.services;

import org.exchange.app.admin.api.model.AccountsReportRequest;
import org.exchange.app.admin.api.model.AccountsReportResponse;

public interface AdminReportsService {

  AccountsReportResponse generateAccountsReport(AccountsReportRequest accountsReportRequest);
}
