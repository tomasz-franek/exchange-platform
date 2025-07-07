package org.exchange.app.backend.admin.services;

import lombok.AllArgsConstructor;
import org.exchange.app.admin.api.model.AccountsReportRequest;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminReportsServiceImpl implements AdminReportsService {

  @Override
  public void generateAccountsReport(AccountsReportRequest accountsReportRequest) {
    //todo implement
  }
}
