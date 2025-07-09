import {inject, Injectable} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap} from 'rxjs';
import {
  selectTransactionsAction,
  selectTransactionsFailure,
  selectTransactionsSuccess
} from "./transaction.actions";

@Injectable()
export class TransactionEffects {
  private readonly _apiService$: ApiService = inject(ApiService);

  selectUserTransactions$ = createEffect(() => {
    return inject(Actions).pipe(
        ofType(selectTransactionsAction),
        mergeMap((action) => {
          return this._apiService$.selectTransactions(action.selectTransactionRequest).pipe(
              map((transactions) => {
                return selectTransactionsSuccess({transactions});
              }),
              catchError((error: any) => {
                return [selectTransactionsFailure({error})];
              }),
          );
        }),
    );
  });
}
