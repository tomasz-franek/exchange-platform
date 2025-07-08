package org.exchange.app.backend.admin.services;

import org.exchange.app.admin.api.model.UsersStatisticRequest;
import org.exchange.app.admin.api.model.UsersStatisticResponse;

public interface AdminStatisticsService {

  UsersStatisticResponse loadUsersStatistic(
      UsersStatisticRequest usersStatisticRequest);

}
