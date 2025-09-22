package org.exchange.app.backend.admin.controllers;

import java.util.List;
import org.exchange.app.backend.admin.services.AdminPropertiesService;
import org.exchange.app.backend.common.utils.BuildInfoUtils;
import org.exchange.app.common.api.SystemApi;
import org.exchange.app.common.api.model.BuildInfo;
import org.exchange.app.common.api.model.SystemCurrency;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminSystemController implements SystemApi {

  private final AdminPropertiesService adminPropertiesService;

  @Autowired
  public AdminSystemController(AdminPropertiesService adminPropertiesService) {
    this.adminPropertiesService = adminPropertiesService;
  }


  @Override
  public ResponseEntity<BuildInfo> loadBuildInfo() {
    return ResponseEntity.ok(BuildInfoUtils.prepareBuildInfo());
  }

  @Override
  public ResponseEntity<List<SystemCurrency>> loadSystemCurrencyList() {
    return ResponseEntity.ok(adminPropertiesService.loadSystemCurrencyList());
  }
}
