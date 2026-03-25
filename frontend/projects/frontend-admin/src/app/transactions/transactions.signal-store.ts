import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ApiService } from '../../services/api.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Transaction } from '../api/model/transaction';
import { SelectTransactionRequest } from '../api/model/selectTransactionRequest';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { SelectUserTransactionRequest } from '../api/model/selectUserTransactionRequest';

type TransactionState = {
  transactions: Transaction[];
  transactionsTotal: number;
  systemTransactions: Transaction[];
  systemTransactionsTotal: number;
  exchangeTransactions: Transaction[];
  exchangeTransactionsTotal: number;
  userTransactions: Transaction[];
  userTransactionsTotal: number;
  isLoading: boolean;
};
export const initialTransactionState: TransactionState = {
  transactions: [],
  transactionsTotal: 0,
  systemTransactions: [],
  systemTransactionsTotal: 0,
  exchangeTransactions: [],
  exchangeTransactionsTotal: 0,
  userTransactions: [],
  userTransactionsTotal: 0,
  isLoading: false,
};

export const TransactionsStore = signalStore(
  { providedIn: 'root' },
  withState(initialTransactionState),
  withMethods(
    (
      store,
      apiService = inject(ApiService),
      translateService = inject(TranslateService),
      messageService = inject(MessageService),
    ) => ({
      loadTransactionList: rxMethod<SelectTransactionRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((selectTransactionRequest) => {
            return apiService
              .loadTransactionList(selectTransactionRequest)
              .pipe(
                tapResponse({
                  next: (transactionsResponse) =>
                    patchState(store, {
                      transactions: transactionsResponse.items,
                      transactionsTotal: transactionsResponse.totalRecords,
                    }),
                  error: (errorResponse: HttpErrorResponse) => {
                    messageService.add({
                      severity: 'error',
                      detail:
                        translateService.instant('ERRORS.LOAD') +
                        errorResponse.message,
                    });
                    patchState(store, {
                      transactions: [],
                      transactionsTotal: 0,
                    });
                  },
                  finalize: () => patchState(store, { isLoading: false }),
                }),
              );
          }),
        ),
      ),
      loadSystemAccountTransactionList: rxMethod<SelectTransactionRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((selectTransactionRequest) => {
            return apiService
              .loadSystemAccountTransactionList(selectTransactionRequest)
              .pipe(
                tapResponse({
                  next: (transactionsResponse) =>
                    patchState(store, {
                      systemTransactions: transactionsResponse.items,
                      systemTransactionsTotal:
                        transactionsResponse.totalRecords,
                    }),
                  error: (errorResponse: HttpErrorResponse) => {
                    messageService.add({
                      severity: 'error',
                      detail:
                        translateService.instant('ERRORS.LOAD') +
                        errorResponse.message,
                    });
                    patchState(store, {
                      systemTransactions: [],
                      systemTransactionsTotal: 0,
                    });
                  },
                  finalize: () => patchState(store, { isLoading: false }),
                }),
              );
          }),
        ),
      ),
      loadExchangeAccountTransactionList: rxMethod<SelectTransactionRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((selectTransactionRequest) => {
            return apiService
              .loadExchangeAccountTransactionList(selectTransactionRequest)
              .pipe(
                tapResponse({
                  next: (transactionsResponse) =>
                    patchState(store, {
                      exchangeTransactions: transactionsResponse.items,
                      exchangeTransactionsTotal:
                        transactionsResponse.totalRecords,
                    }),
                  error: (errorResponse: HttpErrorResponse) => {
                    messageService.add({
                      severity: 'error',
                      detail:
                        translateService.instant('ERRORS.LOAD') +
                        errorResponse.message,
                    });
                    patchState(store, {
                      exchangeTransactions: [],
                      exchangeTransactionsTotal: 0,
                    });
                  },
                  finalize: () => patchState(store, { isLoading: false }),
                }),
              );
          }),
        ),
      ),
      clearUserTransactionList: rxMethod<void>(
        pipe(
          tap(() =>
            patchState(store, {
              userTransactions: [],
              userTransactionsTotal: 0,
            }),
          ),
        ),
      ),
      loadUserTransactionList: rxMethod<SelectUserTransactionRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((selectTransactionRequest) => {
            return apiService
              .loadUserTransactionList(selectTransactionRequest)
              .pipe(
                tapResponse({
                  next: (transactionsResponse) =>
                    patchState(store, {
                      userTransactions: transactionsResponse.items,
                      userTransactionsTotal: transactionsResponse.totalRecords,
                    }),
                  error: (errorResponse: HttpErrorResponse) => {
                    messageService.add({
                      severity: 'error',
                      detail:
                        translateService.instant('ERRORS.LOAD') +
                        errorResponse.message,
                    });
                    patchState(store, {
                      userTransactions: [],
                      userTransactionsTotal: 0,
                    });
                  },
                  finalize: () => patchState(store, { isLoading: false }),
                }),
              );
          }),
        ),
      ),
    }),
  ),
);
