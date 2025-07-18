import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs';
import {
  loadCurrencyRateListAction,
  loadCurrencyRateListActionError,
  loadCurrencyRateListActionSuccess,
} from './rate.actions';

@Injectable()
export class RateEffects {
  private _apiService$: ApiService = inject(ApiService);

  loadCurrencyRateList$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadCurrencyRateListAction),
      mergeMap(() => {
        return this._apiService$.loadCurrencyRates().pipe(
          map((data) => {
            return loadCurrencyRateListActionSuccess({ currencyRates: data });
          }),
          catchError((error: any) => {
            return [loadCurrencyRateListActionError({ error })];
          }),
        );
      }),
    );
  });
}
