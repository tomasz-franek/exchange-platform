import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs';
import {
  loadCurrencyStatisticAction,
  loadCurrencyStatisticFailure,
  loadCurrencyStatisticSuccess,
  loadPairStatisticAction,
  loadPairStatisticFailure,
  loadPairStatisticSuccess,
  loadUserStatisticAction,
  loadUserStatisticFailure,
  loadUserStatisticSuccess,
} from './statistic.actions';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class StatisticEffects {
  private readonly _apiService$: ApiService = inject(ApiService);

  loadUserStatistic$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadUserStatisticAction),
      mergeMap((action) => {
        return this._apiService$
          .loadUsersStatistic(action.usersStatisticRequest)
          .pipe(
            map((usersStatisticResponse) => {
              return loadUserStatisticSuccess({ usersStatisticResponse });
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return [loadUserStatisticFailure({ errorResponse })];
            }),
          );
      }),
    );
  });

  loadCurrencyStatistic$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadCurrencyStatisticAction),
      mergeMap((action) => {
        return this._apiService$.loadCurrencyStatistics(action.currency).pipe(
          map((currencyStatisticResponse) => {
            return loadCurrencyStatisticSuccess({ currencyStatisticResponse });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadCurrencyStatisticFailure({ errorResponse })];
          }),
        );
      }),
    );
  });

  loadPairStatistic$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadPairStatisticAction),
      mergeMap((action) => {
        return this._apiService$.loadPairStatistics(action.pair).pipe(
          map((pairStatisticResponse) => {
            return loadPairStatisticSuccess({ pairStatisticResponse });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadPairStatisticFailure({ errorResponse })];
          }),
        );
      }),
    );
  });
}
