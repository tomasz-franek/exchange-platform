package org.exchange.app.backend.admin.services;

import lombok.AllArgsConstructor;
import org.exchange.app.admin.api.model.UsersStatisticRequest;
import org.exchange.app.admin.api.model.UsersStatisticResponse;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminStatisticsServiceImpl implements AdminStatisticsService {

  @Override
  public UsersStatisticResponse loadUsersStatistic(
      UsersStatisticRequest usersStatisticRequest) {
    //todo read data from db
    return new UsersStatisticResponse(1, 2, 3);
  }
}
