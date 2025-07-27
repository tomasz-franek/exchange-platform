package org.exchange.app.backend.admin.services;

import org.exchange.app.admin.api.model.CurrencyStatisticResponse;
import org.exchange.app.admin.api.model.PairStatisticResponse;
import org.exchange.app.admin.api.model.UsersStatisticRequest;
import org.exchange.app.admin.api.model.UsersStatisticResponse;
import org.exchange.app.common.api.model.Pair;

public interface AdminStatisticsService {

  UsersStatisticResponse loadUsersStatistic(
      UsersStatisticRequest usersStatisticRequest);

  CurrencyStatisticResponse loadCurrencyStatistics(String currency);

  PairStatisticResponse loadPairStatistics(Pair pair);
}
