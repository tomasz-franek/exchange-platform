package org.exchange.app.backend.admin.controllers;

import org.exchange.app.backend.common.utils.BuildInfoUtils;
import org.exchange.app.common.api.SystemApi;
import org.exchange.app.common.api.model.BuildInfo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminSystemController implements SystemApi {

  @Override
  public ResponseEntity<BuildInfo> loadBuildInfo() {
    return ResponseEntity.ok(BuildInfoUtils.prepareBuildInfo());
  }
}
