package org.exchange.app.backend.admin.services;

import java.util.List;
import lombok.AllArgsConstructor;
import org.exchange.app.admin.api.model.AccountsReportRequest;
import org.exchange.app.admin.api.model.AccountsReportResponse;
import org.exchange.app.admin.api.model.SystemAccountOperation;
import org.exchange.app.admin.api.model.SystemAccountOperationsRequest;
import org.exchange.app.backend.admin.pdfs.SystemOperationPdf;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminReportsServiceImpl implements AdminReportsService {

  private final AuthenticationFacade authenticationFacade;
  private final AdminAccountsService adminAccountsService;

  @Override
  public AccountsReportResponse generateAccountsReport(
      AccountsReportRequest accountsReportRequest) {
    //authenticationFacade.checkIsAdmin(AccountsReportRequest.class);
    //todo implement
    return new AccountsReportResponse();

  }

  @Override
  public byte[] loadSystemOperationPdfDocument(
      SystemAccountOperationsRequest pdfDocumentRequest) {
    List<SystemAccountOperation> operationList = adminAccountsService.loadSystemAccountOperationList(
        pdfDocumentRequest);
    return SystemOperationPdf.generatePdf(operationList).toByteArray();
  }
}
