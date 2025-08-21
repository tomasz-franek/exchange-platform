package org.exchange.app.backend.admin.controllers;

import java.util.List;
import org.exchange.app.admin.api.ErrorsApi;
import org.exchange.app.admin.api.model.ErrorListRequest;
import org.exchange.app.admin.api.model.ErrorMessage;
import org.exchange.app.backend.admin.services.AdminErrorsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminErrorsController implements ErrorsApi {

  private final AdminErrorsService adminErrorsService;

  AdminErrorsController(AdminErrorsService adminErrorsService) {
    this.adminErrorsService = adminErrorsService;
  }

  @Override
  public ResponseEntity<List<ErrorMessage>> loadErrorList(ErrorListRequest errorListRequest) {
    return ResponseEntity.ok(adminErrorsService.loadErrorList(errorListRequest));
  }

  @Override
  public ResponseEntity<Void> deleteError(Long id) {
    adminErrorsService.deleteError(id);
    return ResponseEntity.noContent().build();
  }
}
