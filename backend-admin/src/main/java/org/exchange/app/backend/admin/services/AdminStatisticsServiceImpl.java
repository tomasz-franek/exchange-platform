package org.exchange.app.backend.admin.services;

import java.util.List;
import lombok.AllArgsConstructor;
import org.exchange.app.admin.api.model.CurrencyStatisticResponse;
import org.exchange.app.admin.api.model.PairStatisticResponse;
import org.exchange.app.admin.api.model.UsersStatisticRequest;
import org.exchange.app.admin.api.model.UsersStatisticResponse;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.Pair;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminStatisticsServiceImpl implements AdminStatisticsService {

  private final AuthenticationFacade authenticationFacade;
  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final ExchangeEventRepository exchangeEventRepository;

  @Override
  public UsersStatisticResponse loadUsersStatistic(UsersStatisticRequest usersStatisticRequest) {
    //authenticationFacade.checkIsAdmin(UsersStatisticRequest.class);
    String currency = usersStatisticRequest.getCurrency().getValue();
    Integer allTickets = exchangeEventRepository.countAllTickets(
        currency, usersStatisticRequest.getUserId());
    Integer activeTickets = exchangeEventRepository.countActiveTickets(
        currency,
        usersStatisticRequest.getUserId());
    Long amountInTickets = exchangeEventSourceRepository.sumTicketsAmountForCurrencyAndUser(
        currency, usersStatisticRequest.getUserId());
    Long amountAccountTotal = exchangeEventSourceRepository.sumAccountsAmountForCurrencyAndUser(
        currency, usersStatisticRequest.getUserId());
    return new UsersStatisticResponse(
        allTickets == null ? 0 : allTickets,
        activeTickets == null ? 0 : activeTickets,
        amountInTickets == null ? 0 : amountInTickets,
        amountAccountTotal == null ? 0 : amountAccountTotal);
  }

  @Override
  public CurrencyStatisticResponse loadCurrencyStatistics(String currency) {
    //authenticationFacade.checkIsAdmin(String.class);
    Long amountTotal = exchangeEventSourceRepository.sumAccountsAmountForCurrencyAndUser(currency,
        null);
    Long amountInTickets = exchangeEventSourceRepository.sumTicketsAmountForCurrencyAndUser(
        currency, null);
    return new CurrencyStatisticResponse(
        amountTotal == null ? 0 : amountTotal,
        amountInTickets == null ? 0 : amountInTickets,
        Currency.fromValue(currency.toUpperCase())
    );
  }

  @Override
  public PairStatisticResponse loadPairStatistics(Pair pair) {
    //authenticationFacade.checkIsAdmin(Pair.class);
    List<Long> amountSellTicketList = exchangeEventRepository.getActiveTicketsAmount(pair, "S");
    List<Long> amountBuyTicketList = exchangeEventRepository.getActiveTicketsAmount(pair, "B");
    return new PairStatisticResponse(
        amountSellTicketList.stream().reduce(0L, Long::sum),
        amountSellTicketList.size(),
        amountBuyTicketList.stream().reduce(0L, Long::sum),
        amountBuyTicketList.size());
  }
}
