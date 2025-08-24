package org.exchange.app.backend.external.services;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.extern.log4j.Log4j2;
import org.exchange.app.backend.common.exceptions.InsufficientFundsException;
import org.exchange.app.backend.common.exceptions.ObjectWithIdNotFoundException;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.common.utils.CurrencyUtils;
import org.exchange.app.backend.common.utils.ExchangeDateUtils;
import org.exchange.app.backend.db.entities.CurrencyEntity;
import org.exchange.app.backend.db.entities.ExchangeEventEntity;
import org.exchange.app.backend.db.mappers.ExchangeEventMapper;
import org.exchange.app.backend.db.repositories.ExchangeEventRepository;
import org.exchange.app.backend.db.repositories.UserAccountRepository;
import org.exchange.app.backend.db.specifications.ExchangeEventSpecification;
import org.exchange.app.backend.external.producers.InternalTicketProducer;
import org.exchange.app.common.api.model.EventType;
import org.exchange.app.common.api.model.UserTicket;
import org.exchange.app.external.api.model.AccountBalance;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Log4j2
@Service
public class TicketsServiceImpl implements TicketsService {

  private final InternalTicketProducer internalTicketProducer;

  private final ExchangeEventRepository exchangeEventRepository;

  private final UserAccountRepository userAccountRepository;

  private final AuthenticationFacade authenticationFacade;

  public TicketsServiceImpl(InternalTicketProducer internalTicketProducer,
      ExchangeEventRepository exchangeEventRepository, UserAccountRepository userAccountRepository,
      AuthenticationFacade authenticationFacade) {

    this.internalTicketProducer = internalTicketProducer;
    this.exchangeEventRepository = exchangeEventRepository;
    this.userAccountRepository = userAccountRepository;
    this.authenticationFacade = authenticationFacade;
  }


  @Override
  public void saveUserTicket(UserTicket userTicket) {
    UUID userId = authenticationFacade.getUserUuid();
    userTicket.setUserId(userId);
    userTicket.setEventType(EventType.ORDER);
    List<AccountBalance> balances = userAccountRepository.getAccountBalances(userId);
    String currency = CurrencyUtils.pairToCurrency(userTicket.getPair(), userTicket.getDirection());
    String reverseCurrency = CurrencyUtils.pairReverseCurrencyString(userTicket.getPair(),
        userTicket.getDirection());
    if (currency == null || currency.isEmpty()) {
      throw new ObjectWithIdNotFoundException("UserAccount",
          String.format("Currency for Pair %s and Direction %s",
              userTicket.getPair(), userTicket.getDirection()));
    }
    AccountBalance sourceBalance = balances.stream().filter(b -> b.getCurrency().equals(currency))
        .findFirst()
        .orElseThrow(() -> new ObjectWithIdNotFoundException("UserAccount",
            String.format("Not found account for currency %s", currency)));
    if (sourceBalance.getAmount().compareTo(userTicket.getAmount()) < 0) {
      throw new InsufficientFundsException(CurrencyEntity.class, currency);
    }
    if (balances.stream().noneMatch(b -> b.getCurrency().equals(reverseCurrency))) {
      throw new ObjectWithIdNotFoundException("UserAccount",
          String.format("Not found account for currency %s", reverseCurrency));
    }
    try {
      internalTicketProducer.sendMessage(userTicket);
    } catch (Exception e) {
      log.error(e.getMessage());
    }
  }

  @Override
  public void cancelExchangeTicket(UserTicket userTicket) {
    UUID userId = authenticationFacade.getUserUuid();
    userTicket.setUserId(userId);
    userTicket.setEventType(EventType.CANCEL);
    internalTicketProducer.sendMessage(userTicket);
  }

  @Override
  public List<UserTicket> loadUserTicketList() {
    List<UserTicket> userTicketList = new ArrayList<>();
    UUID userId = authenticationFacade.getUserUuid();
    Specification<ExchangeEventEntity> exchangeEventSourceSpecification =
        ExchangeEventSpecification
            .userAccountID(userAccounts(userId))
            .and(
                ExchangeEventSpecification.fromDate(
                    ExchangeDateUtils.currentLocalDateTime().minusDays(10)))
            .and(ExchangeEventSpecification.onlyActive());
    exchangeEventRepository.findAll(exchangeEventSourceSpecification)
        .forEach(exchangeEventSourceEntity -> userTicketList.add(
            ExchangeEventMapper.INSTANCE.toDto(exchangeEventSourceEntity)));
    return userTicketList;
  }

  @Override
  public List<UserTicket> loadRealizedTicketList() {
    List<UserTicket> userTicketList = new ArrayList<>();
    UUID userId = authenticationFacade.getUserUuid();
    Specification<ExchangeEventEntity> exchangeEventSourceSpecification =
        ExchangeEventSpecification
            .userAccountID(userAccounts(userId))
            .and(
                ExchangeEventSpecification.fromDate(
                    ExchangeDateUtils.currentLocalDateTime().minusDays(10)))
            .and(ExchangeEventSpecification.realized());
    exchangeEventRepository.findAll(exchangeEventSourceSpecification,
            Sort.by(Order.desc("modifiedDateUtc")))
        .forEach(exchangeEventSourceEntity -> userTicketList.add(
            ExchangeEventMapper.INSTANCE.toDto(exchangeEventSourceEntity)));
    return userTicketList;
  }

  private List<UUID> userAccounts(UUID userId) {
    return userAccountRepository.findAccountsForUser(userId);
  }
}
