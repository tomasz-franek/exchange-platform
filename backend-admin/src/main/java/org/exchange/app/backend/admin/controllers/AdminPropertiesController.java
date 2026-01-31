package org.exchange.app.backend.admin.controllers;

import org.exchange.app.admin.api.PropertiesApi;
import org.exchange.app.backend.admin.services.AdminPropertiesService;
import org.exchange.app.common.api.model.SystemCurrency;
import org.exchange.app.common.api.model.Withdraw;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminPropertiesController implements PropertiesApi {

  private final AdminPropertiesService adminPropertiesService;

  @Autowired
  public AdminPropertiesController(AdminPropertiesService adminPropertiesService) {
    this.adminPropertiesService = adminPropertiesService;
  }

  @Override
  public ResponseEntity<Void> updateSystemCurrency(SystemCurrency systemCurrency) {
    adminPropertiesService.updateSystemCurrency(systemCurrency);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<Void> saveWithdrawLimit(Withdraw withdraw) {
    adminPropertiesService.saveWithdrawLimit(withdraw);
    return ResponseEntity.noContent().build();
  }

  @Override
  public ResponseEntity<Void> updateWithdrawLimit(Withdraw withdraw) {
    adminPropertiesService.updateWithdrawLimit(withdraw);
    return ResponseEntity.noContent().build();
  }
}
