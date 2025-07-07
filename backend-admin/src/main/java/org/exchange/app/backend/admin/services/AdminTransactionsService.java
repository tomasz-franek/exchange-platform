package org.exchange.app.backend.admin.services;

import java.util.List;
import org.exchange.app.admin.api.model.ListTransactionRequest;
import org.exchange.app.admin.api.model.Transaction;

public interface AdminTransactionsService {

  List<Transaction> listTransactions(ListTransactionRequest listTransactionRequest);
}
