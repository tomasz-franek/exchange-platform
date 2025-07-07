package org.exchange.app.backend.admin.controllers;

import org.exchange.app.admin.api.StatisticsApi;
import org.exchange.app.admin.api.model.UsersStatisticResponse;
import org.exchange.app.backend.admin.services.AdminStatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:4100")
@RestController
public class AdminStatisticsController implements StatisticsApi {

  private final AdminStatisticsService adminStatisticsService;

  @Autowired
  public AdminStatisticsController(AdminStatisticsService adminStatisticsService) {
    this.adminStatisticsService = adminStatisticsService;
  }

  @Override
  public ResponseEntity<UsersStatisticResponse> getUsersStatistic() {
    return ResponseEntity.ok(adminStatisticsService.getUsersStatistic());
  }
}
