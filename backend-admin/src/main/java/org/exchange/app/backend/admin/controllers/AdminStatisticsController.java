package org.exchange.app.backend.admin.controllers;

import org.exchange.app.admin.api.StatisticsApi;
import org.exchange.app.admin.api.model.CurrencyStatisticResponse;
import org.exchange.app.admin.api.model.PairStatisticResponse;
import org.exchange.app.admin.api.model.UsersStatisticRequest;
import org.exchange.app.admin.api.model.UsersStatisticResponse;
import org.exchange.app.backend.admin.services.AdminStatisticsService;
import org.exchange.app.common.api.model.Pair;
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
  public ResponseEntity<UsersStatisticResponse> loadUsersStatistic(
      UsersStatisticRequest usersStatisticRequest) {
    return ResponseEntity.ok(adminStatisticsService.loadUsersStatistic(usersStatisticRequest));
  }

  @Override
  public ResponseEntity<CurrencyStatisticResponse> loadCurrencyStatistics(String currency) {
    return ResponseEntity.ok(adminStatisticsService.loadCurrencyStatistics(currency));
  }

  @Override
  public ResponseEntity<PairStatisticResponse> loadPairStatistics(Pair pair) {
    return ResponseEntity.ok(adminStatisticsService.loadPairStatistics(pair));
  }
}
