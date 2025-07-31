import {inject, Injectable} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap} from 'rxjs';
import {
  loadTransactionListAction,
  loadTransactionListFailure,
  loadTransactionListSuccess
} from "./transaction.actions";
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class TransactionEffects {
  private readonly _apiService$: ApiService = inject(ApiService);

  selectUserTransactions$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadTransactionListAction),
      mergeMap((action) => {
        return this._apiService$.loadTransactionList(action.selectTransactionRequest).pipe(
          map((transactions) => {
            return loadTransactionListSuccess({transactions});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadTransactionListFailure({errorResponse})];
          }),
        );
      }),
    );
  });
}
