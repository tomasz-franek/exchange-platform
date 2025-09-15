package org.exchange.app.backend.admin.services;

import lombok.AllArgsConstructor;
import org.exchange.app.admin.api.model.CurrencyStatisticResponse;
import org.exchange.app.admin.api.model.PairStatisticResponse;
import org.exchange.app.admin.api.model.UsersStatisticRequest;
import org.exchange.app.admin.api.model.UsersStatisticResponse;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.common.api.model.Pair;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminStatisticsServiceImpl implements AdminStatisticsService {

  private final AuthenticationFacade authenticationFacade;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;

  @Override
  public UsersStatisticResponse loadUsersStatistic(UsersStatisticRequest usersStatisticRequest) {
    //authenticationFacade.checkIsAdmin(UsersStatisticRequest.class);
    //todo read data from db
    return new UsersStatisticResponse(1, 2, 3L, 4L);
  }

  @Override
  public CurrencyStatisticResponse loadCurrencyStatistics(String currency) {
    //authenticationFacade.checkIsAdmin(String.class);
    Long amountTotal = exchangeEventSourceRepository.sumAllForCurrency(currency);
    Long amountInTickets = exchangeEventSourceRepository.loadAllTicketsAmount(currency);
    return new CurrencyStatisticResponse(
        amountTotal == null ? 0 : amountTotal,
        amountInTickets == null ? 0 : amountInTickets,
        currency.toUpperCase()
    );
  }

  @Override
  public PairStatisticResponse loadPairStatistics(Pair pair) {
    //todo read data from db
    //authenticationFacade.checkIsAdmin(Pair.class);
    return new PairStatisticResponse(200L, 30L);
  }
}
