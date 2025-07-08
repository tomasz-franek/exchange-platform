package org.exchange.app.backend.admin.services;

import lombok.AllArgsConstructor;
import org.exchange.app.admin.api.model.AccountsReportRequest;
import org.exchange.app.admin.api.model.AccountsReportResponse;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminReportsServiceImpl implements AdminReportsService {

  @Override
  public AccountsReportResponse generateAccountsReport(
      AccountsReportRequest accountsReportRequest) {
    //todo implement
    return new AccountsReportResponse();
    
  }
}
