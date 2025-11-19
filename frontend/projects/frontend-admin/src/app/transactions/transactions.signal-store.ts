import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {ApiService} from '../../services/api.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {debounceTime, distinctUntilChanged, pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {inject} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {Transaction} from '../api/model/transaction';
import {SelectTransactionRequest} from '../api/model/selectTransactionRequest';

type TransactionState = {
  transactions: Transaction[];
  systemTransactions: Transaction[];
  exchangeTransactions: Transaction[];
  isLoading: boolean;
}
export const initialTransactionState: TransactionState = {
  transactions: [],
  systemTransactions: [],
  exchangeTransactions: [],
  isLoading: false
};

export const transactionsStore = signalStore(
  {providedIn: 'root'},
  withState(initialTransactionState),
  withMethods((store, apiService = inject(ApiService)) => ({
    loadTransactionList: rxMethod<SelectTransactionRequest>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap((selectTransactionRequest) => {
          return apiService.loadTransactionList(selectTransactionRequest).pipe(
            tapResponse({
              next: (transactions) => patchState(store, {transactions}),
              error: (error: HttpErrorResponse) => console.log(error.message),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadSystemAccountTransactionList: rxMethod<SelectTransactionRequest>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap((selectTransactionRequest) => {
          return apiService.loadSystemAccountTransactionList(selectTransactionRequest).pipe(
            tapResponse({
              next: (systemTransactions) => patchState(store, {systemTransactions}),
              error: (error: HttpErrorResponse) => console.log(error.message),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadExchangeAccountTransactionList: rxMethod<SelectTransactionRequest>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap((selectTransactionRequest) => {
          return apiService.loadExchangeAccountTransactionList(selectTransactionRequest).pipe(
            tapResponse({
              next: (exchangeTransactions) => patchState(store, {exchangeTransactions}),
              error: (error: HttpErrorResponse) => console.log(error.message),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
  }))
);
