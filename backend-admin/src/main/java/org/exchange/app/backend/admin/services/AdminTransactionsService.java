package org.exchange.app.backend.admin.services;

import org.exchange.app.admin.api.model.CorrectionId;
import org.exchange.app.admin.api.model.CorrectionRequest;
import org.exchange.app.admin.api.model.SelectTransactionRequest;
import org.exchange.app.admin.api.model.SelectUserTransactionRequest;
import org.exchange.app.admin.api.model.TransactionsResponse;

public interface AdminTransactionsService {

  TransactionsResponse loadTransactionList(SelectTransactionRequest selectTransactionRequest);

  TransactionsResponse loadExchangeAccountTransactionList(
      SelectTransactionRequest selectTransactionRequest);

  TransactionsResponse loadSystemAccountTransactionList(
      SelectTransactionRequest selectTransactionRequest);

  CorrectionId saveCorrectionRequest(CorrectionRequest correctionRequest);

  TransactionsResponse loadUserTransactionList(
      SelectUserTransactionRequest selectUserTransactionRequest);
}
