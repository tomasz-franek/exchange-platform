package org.exchange.app.backend.admin.services;

import org.exchange.app.admin.api.model.AccountsReportRequest;

public interface AdminReportsService {

  void generateAccountsReport(AccountsReportRequest accountsReportRequest);
}
