package org.exchange.app.backend.admin.services;

import java.util.ArrayList;
import java.util.List;
import org.exchange.app.admin.api.model.SelectTransactionRequest;
import org.exchange.app.admin.api.model.Transaction;
import org.exchange.app.backend.common.keycloak.AuthenticationFacade;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification;
import org.exchange.app.common.api.model.Currency;
import org.exchange.app.common.api.model.EventType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class AdminTransactionsServiceImpl implements AdminTransactionsService {

  private final ExchangeEventSourceRepository exchangeEventSourceRepository;
  private final AuthenticationFacade authenticationFacade;

  @Autowired
  public AdminTransactionsServiceImpl(ExchangeEventSourceRepository exchangeEventSourceRepository,
      AuthenticationFacade authenticationFacade) {
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
    this.authenticationFacade = authenticationFacade;
  }

  @Override
  public List<Transaction> loadTransactionList(SelectTransactionRequest selectTransactionRequest) {
    //authenticationFacade.checkIsAdmin(Transaction.class);
    Specification<ExchangeEventSourceEntity> exchangeEventSourceSpecification =
        ExchangeEventSourceSpecification.fromDateUtc(
            selectTransactionRequest.getDateFromUtc());
    if (selectTransactionRequest.getDateToUtc() != null) {
      exchangeEventSourceSpecification = exchangeEventSourceSpecification.and(
          ExchangeEventSourceSpecification.toDateUtc(
              selectTransactionRequest.getDateToUtc()
          )
      );
    }
    return getTransactions(exchangeEventSourceSpecification);
  }

  @Override
  public List<Transaction> loadExchangeAccountTransactionList(
      SelectTransactionRequest selectTransactionRequest) {
    //authenticationFacade.checkIsAdmin(Transaction.class);
    Specification<ExchangeEventSourceEntity> exchangeEventSourceSpecification =
        ExchangeEventSourceSpecification.fromDateUtc(
            selectTransactionRequest.getDateFromUtc());
    if (selectTransactionRequest.getDateToUtc() != null) {
      exchangeEventSourceSpecification = exchangeEventSourceSpecification.and(
          ExchangeEventSourceSpecification.toDateUtc(
              selectTransactionRequest.getDateToUtc()
          )
      );
      exchangeEventSourceSpecification = exchangeEventSourceSpecification.and(
          ExchangeEventSourceSpecification.eventType(EventType.FEE)
      );
    }
    return getTransactions(exchangeEventSourceSpecification);
  }

  @Override
  public List<Transaction> loadSystemAccountTransactionList(
      SelectTransactionRequest selectTransactionRequest) {
    //authenticationFacade.checkIsAdmin(Transaction.class);
    Specification<ExchangeEventSourceEntity> exchangeEventSourceSpecification =
        ExchangeEventSourceSpecification.fromDateUtc(
            selectTransactionRequest.getDateFromUtc());
    if (selectTransactionRequest.getDateToUtc() != null) {
      exchangeEventSourceSpecification = exchangeEventSourceSpecification.and(
          ExchangeEventSourceSpecification.toDateUtc(
              selectTransactionRequest.getDateToUtc()
          )
      );
      exchangeEventSourceSpecification = exchangeEventSourceSpecification.and(
          ExchangeEventSourceSpecification.eventType(EventType.EXCHANGE)
      );
    }
    return getTransactions(exchangeEventSourceSpecification);
  }

  private List<Transaction> getTransactions(
      Specification<ExchangeEventSourceEntity> specification) {
    List<Transaction> transactions = new ArrayList<>();
    exchangeEventSourceRepository.findAll(specification,
            Sort.by(new Order(Direction.ASC, "dateUtc")))
        .forEach(exchangeEventSourceEntity ->
            transactions.add(
                new Transaction(
                    exchangeEventSourceEntity.getDateUtc(),
                    exchangeEventSourceEntity.getAmount(),
                    Currency.fromValue(exchangeEventSourceEntity.getCurrency()))
            )
        );
    return transactions;
  }
}
