import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs';
import {
  getUserAddressAction,
  getUserAddressFailure,
  getUserAddressSuccess,
  getUserPropertyAction,
  getUserPropertyFailure,
  getUserPropertySuccess,
  loadLocaleListAction,
  loadLocaleListFailure,
  loadLocaleListSuccess,
  loadStrategyDataAction,
  loadStrategyDataFailure,
  loadStrategyDataSuccess,
  loadSystemCurrencyListAction,
  loadSystemCurrencyListFailure,
  loadSystemCurrencyListSuccess,
  loadTimezoneListAction,
  loadTimezoneListFailure,
  loadTimezoneListSuccess,
  saveUserAddressAction,
  saveUserAddressFailure,
  saveUserAddressSuccess,
  saveUserPropertyAction,
  saveUserPropertyFailure,
  saveUserPropertySuccess,
  updateSystemCurrencyAction,
  updateSystemCurrencyFailure,
  updateSystemCurrencySuccess,
} from './properties.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { StrategiesService } from '../services/strategies.service';

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
  getUserProperty$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(getUserPropertyAction),
      mergeMap(() => {
        return this._apiService$.getUserProperty().pipe(
          map((userProperty) => {
            return getUserPropertySuccess({ userProperty });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [getUserPropertyFailure({ errorResponse })];
          }),
        );
      }),
    );
  });
  getUserAddress$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(getUserAddressAction),
      mergeMap(() => {
        return this._apiService$.getUserAddress().pipe(
          map((userAddress) => {
            return getUserAddressSuccess({ userAddress });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [getUserAddressFailure({ errorResponse })];
          }),
        );
      }),
    );
  });
  loadSystemCurrencyList$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadSystemCurrencyListAction),
      mergeMap(() => {
        return this._apiService$.loadSystemCurrencyList().pipe(
          map((systemCurrencyList) => {
            return loadSystemCurrencyListSuccess({ systemCurrencyList });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadSystemCurrencyListFailure({ errorResponse })];
          }),
        );
      }),
    );
  });
  private _strategiesService$: StrategiesService = inject(StrategiesService);
  loadStrategyData$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadStrategyDataAction),
      mergeMap(() => {
        return this._strategiesService$.loadActuatorStrategyData().pipe(
          map((strategyData) => {
            return loadStrategyDataSuccess({ strategyData });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadStrategyDataFailure({ errorResponse })];
          }),
        );
      }),
    );
  });
  private readonly toasterService: ToastrService = inject(ToastrService);
  saveUserProperty$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(saveUserPropertyAction),
      mergeMap((action) => {
        return this._apiService$.saveUserProperty(action.userProperty).pipe(
          map((userProperty) => {
            this.toasterService.info('Property saved');
            getUserPropertySuccess({ userProperty });
            return saveUserPropertySuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toasterService.error(
              'Error occurred while saving user property',
            );
            return [saveUserPropertyFailure({ errorResponse })];
          }),
        );
      }),
    );
  });
  saveUserAddress$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(saveUserAddressAction),
      mergeMap((action) => {
        return this._apiService$.saveUserAddress(action.address).pipe(
          map((userAddress) => {
            this.toasterService.info('Address saved');
            getUserAddressSuccess({ userAddress });
            return saveUserAddressSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toasterService.error(
              'Error occurred while saving user address',
            );
            return [saveUserAddressFailure({ errorResponse })];
          }),
        );
      }),
    );
  });
  updateSystemCurrency$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(updateSystemCurrencyAction),
      mergeMap((action) => {
        return this._apiService$
          .updateSystemCurrency(action.systemCurrency)
          .pipe(
            map(() => {
              this.toasterService.info('Currency saved');
              return updateSystemCurrencySuccess();
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return [updateSystemCurrencyFailure({ errorResponse })];
            }),
          );
      }),
    );
  });
}
