package org.exchange.app.backend.admin.controllers;

import java.util.List;
import org.exchange.app.backend.admin.services.AdminPropertiesService;
import org.exchange.app.backend.admin.services.AdminSystemMessagesService;
import org.exchange.app.backend.common.utils.BuildInfoUtils;
import org.exchange.app.common.api.SystemApi;
import org.exchange.app.common.api.model.BuildInfo;
import org.exchange.app.common.api.model.SystemCurrency;
import org.exchange.app.common.api.model.SystemMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminSystemController implements SystemApi {

  private final AdminPropertiesService adminPropertiesService;

  private final AdminSystemMessagesService adminSystemMessagesService;

  @Autowired
  public AdminSystemController(AdminPropertiesService adminPropertiesService,
      AdminSystemMessagesService adminSystemMessagesService) {
    this.adminPropertiesService = adminPropertiesService;
    this.adminSystemMessagesService = adminSystemMessagesService;
  }


  @Override
  public ResponseEntity<BuildInfo> loadBuildInfo() {
    return ResponseEntity.ok(BuildInfoUtils.prepareBuildInfo());
  }

  @Override
  public ResponseEntity<List<SystemCurrency>> loadSystemCurrencyList() {
    return ResponseEntity.ok(adminPropertiesService.loadSystemCurrencyList());
  }

  @Override
  public ResponseEntity<List<SystemMessage>> loadSystemMessageList() {
    return ResponseEntity.ok(adminSystemMessagesService.loadSystemMessageList());
  }
}
