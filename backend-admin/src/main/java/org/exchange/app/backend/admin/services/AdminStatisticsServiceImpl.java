package org.exchange.app.backend.admin.services;

import lombok.AllArgsConstructor;
import org.exchange.app.admin.api.model.CurrencyStatisticResponse;
import org.exchange.app.admin.api.model.PairStatisticResponse;
import org.exchange.app.admin.api.model.UsersStatisticRequest;
import org.exchange.app.admin.api.model.UsersStatisticResponse;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.common.api.model.Pair;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminStatisticsServiceImpl implements AdminStatisticsService {

  private final AuthenticationFacade authenticationFacade;

  @Override
  public UsersStatisticResponse loadUsersStatistic(
      UsersStatisticRequest usersStatisticRequest) {
    //authenticationFacade.checkIsAdmin(UsersStatisticRequest.class);
    //todo read data from db
    return new UsersStatisticResponse(1, 2, 3);
  }

  @Override
  public CurrencyStatisticResponse loadCurrencyStatistics(String currency) {
    //todo read data from db
    //authenticationFacade.checkIsAdmin(String.class);
    return new CurrencyStatisticResponse(100L, 50L);
  }

  @Override
  public PairStatisticResponse loadPairStatistics(Pair pair) {
    //todo read data from db
    //authenticationFacade.checkIsAdmin(Pair.class);
    return new PairStatisticResponse(200L, 30L);
  }
}
