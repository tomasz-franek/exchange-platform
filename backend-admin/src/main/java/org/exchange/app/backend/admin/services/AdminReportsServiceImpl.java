package org.exchange.app.backend.admin.services;

import lombok.AllArgsConstructor;
import org.exchange.app.admin.api.model.AccountsReportRequest;
import org.exchange.app.admin.api.model.AccountsReportResponse;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminReportsServiceImpl implements AdminReportsService {

  private final AuthenticationFacade authenticationFacade;

  @Override
  public AccountsReportResponse generateAccountsReport(
      AccountsReportRequest accountsReportRequest) {
    authenticationFacade.checkIsAdmin(AccountsReportRequest.class);
    //todo implement
    return new AccountsReportResponse();

  }
}
