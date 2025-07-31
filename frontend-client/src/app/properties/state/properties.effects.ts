import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs';
import {
  loadLocaleListAction,
  loadLocaleListFailure,
  loadLocaleListSuccess,
  loadTimezoneListAction,
  loadTimezoneListFailure,
  loadTimezoneListSuccess,
} from './properties.actions';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class PropertiesEffects {
  private _apiService$: ApiService = inject(ApiService);

  loadTimezones$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadTimezoneListAction),
      mergeMap(() => {
        return this._apiService$.loadTimezoneList().pipe(
          map((data) => {
            return loadTimezoneListSuccess({ timezones: data });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadTimezoneListFailure({ errorResponse })];
          }),
        );
      }),
    );
  });
  loadLocales$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadLocaleListAction),
      mergeMap(() => {
        return this._apiService$.loadUnicodeLocalesList().pipe(
          map((data) => {
            return loadLocaleListSuccess({ locales: data });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadLocaleListFailure({ errorResponse })];
          }),
        );
      }),
    );
  });
}
