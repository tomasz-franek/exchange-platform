package org.exchange.app.backend.external.controllers;

import java.util.List;
import org.exchange.app.backend.common.utils.BuildInfoUtils;
import org.exchange.app.backend.external.services.SystemService;
import org.exchange.app.common.api.SystemApi;
import org.exchange.app.common.api.model.BuildInfo;
import org.exchange.app.common.api.model.SystemMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
public class SystemController implements SystemApi {

  private final SystemService systemService;

  @Autowired
  public SystemController(SystemService systemService) {
    this.systemService = systemService;
  }

  @Override
  public ResponseEntity<BuildInfo> loadBuildInfo() {
    return ResponseEntity.ok(BuildInfoUtils.prepareBuildInfo());
  }

  @Override
  public ResponseEntity<List<SystemMessage>> loadSystemMessageList() {
    return ResponseEntity.ok(systemService.loadSystemMessageList());
  }
}
