import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs';
import {
  loadExchangeAccountTransactionListAction,
  loadExchangeAccountTransactionListFailure,
  loadExchangeAccountTransactionListSuccess,
  loadSystemAccountTransactionListAction,
  loadSystemAccountTransactionListFailure,
  loadSystemAccountTransactionListSuccess,
  loadTransactionListAction,
  loadTransactionListFailure,
  loadTransactionListSuccess,
} from './transaction.actions';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class TransactionEffects {
  private readonly _apiService$: ApiService = inject(ApiService);

  loadUserTransactions$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadTransactionListAction),
      mergeMap((action) => {
        return this._apiService$
          .loadTransactionList(action.selectTransactionRequest)
          .pipe(
            map((transactions) => {
              return loadTransactionListSuccess({ transactions });
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return [loadTransactionListFailure({ errorResponse })];
            }),
          );
      }),
    );
  });

  loadSystemAccountTransaction$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadSystemAccountTransactionListAction),
      mergeMap((action) => {
        return this._apiService$
          .loadSystemAccountTransactionList(action.selectTransactionRequest)
          .pipe(
            map((systemTransactions) => {
              return loadSystemAccountTransactionListSuccess({
                systemTransactions,
              });
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return [
                loadSystemAccountTransactionListFailure({ errorResponse }),
              ];
            }),
          );
      }),
    );
  });

  loadExchangeAccountTransaction$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadExchangeAccountTransactionListAction),
      mergeMap((action) => {
        return this._apiService$
          .loadExchangeAccountTransactionList(action.selectTransactionRequest)
          .pipe(
            map((exchangeTransactions) => {
              return loadExchangeAccountTransactionListSuccess({
                exchangeTransactions,
              });
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return [
                loadExchangeAccountTransactionListFailure({ errorResponse }),
              ];
            }),
          );
      }),
    );
  });
}
