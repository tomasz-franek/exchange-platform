package org.exchange.app.backend.admin.services;

import java.util.List;
import lombok.AllArgsConstructor;
import org.exchange.app.admin.api.model.ListTransactionRequest;
import org.exchange.app.admin.api.model.Transaction;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AdminTransactionsServiceImpl implements AdminTransactionsService {

  @Override
  public List<Transaction> listTransactions(ListTransactionRequest listTransactionRequest) {
    return List.of();
  }
}
