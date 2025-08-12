package org.exchange.app.backend.admin.services;

import java.util.ArrayList;
import java.util.List;
import org.exchange.app.admin.api.model.SelectTransactionRequest;
import org.exchange.app.admin.api.model.Transaction;
import org.exchange.app.backend.db.entities.ExchangeEventSourceEntity;
import org.exchange.app.backend.db.repositories.ExchangeEventSourceRepository;
import org.exchange.app.backend.db.specifications.ExchangeEventSourceSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

@Service
public class AdminTransactionsServiceImpl implements AdminTransactionsService {

  private final ExchangeEventSourceRepository exchangeEventSourceRepository;

  @Autowired
  public AdminTransactionsServiceImpl(ExchangeEventSourceRepository exchangeEventSourceRepository) {
    this.exchangeEventSourceRepository = exchangeEventSourceRepository;
  }

  @Override
  public List<Transaction> loadTransactionList(SelectTransactionRequest selectTransactionRequest) {
    Specification<ExchangeEventSourceEntity> exchangeEventSourceSpecification =
        ExchangeEventSourceSpecification.fromDate(
            selectTransactionRequest.getDateFromUTC());
    if (selectTransactionRequest.getDateToUTC() != null) {
      exchangeEventSourceSpecification.and(
          ExchangeEventSourceSpecification.toDate(
              selectTransactionRequest.getDateToUTC()
          )
      );
    }
    List<Transaction> transactions = new ArrayList<>();
    exchangeEventSourceRepository.findAll(exchangeEventSourceSpecification,
            Sort.by(new Order(Direction.ASC, "dateUtc")))
        .forEach(exchangeEventSourceEntity ->
            transactions.add(
                new Transaction(
                    exchangeEventSourceEntity.getDateUtc(),
                    exchangeEventSourceEntity.getAmount())
            )
        );
    return transactions;
  }
}
