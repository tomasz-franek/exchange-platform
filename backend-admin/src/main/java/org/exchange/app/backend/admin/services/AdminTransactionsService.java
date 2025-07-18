package org.exchange.app.backend.admin.services;

import java.util.List;
import org.exchange.app.admin.api.model.SelectTransactionRequest;
import org.exchange.app.admin.api.model.Transaction;

public interface AdminTransactionsService {

  List<Transaction> selectTransactions(SelectTransactionRequest selectTransactionRequest);
}
