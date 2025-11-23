import {inject, Injectable} from '@angular/core';
import {ApiService} from '../../../services/api/api.service';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap} from 'rxjs';
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
  saveUserPropertySuccess
} from './properties.actions';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class PropertiesEffects {
  private _apiService$: ApiService = inject(ApiService);
  loadTimezones$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadTimezoneListAction),
      mergeMap(() => {
        return this._apiService$.loadTimezoneList().pipe(
          map((data) => {
            return loadTimezoneListSuccess({timezones: data});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadTimezoneListFailure({errorResponse})];
          })
        );
      })
    );
  });
  loadLocales$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadLocaleListAction),
      mergeMap(() => {
        return this._apiService$.loadUnicodeLocalesList().pipe(
          map((data) => {
            return loadLocaleListSuccess({locales: data});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadLocaleListFailure({errorResponse})];
          })
        );
      })
    );
  });
  getUserProperty$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(getUserPropertyAction),
      mergeMap(() => {
        return this._apiService$.getUserProperty().pipe(
          map((data) => {
            return getUserPropertySuccess({userProperty: data});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [getUserPropertyFailure({errorResponse})];
          })
        );
      })
    );
  });
  getUserAddress$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(getUserAddressAction),
      mergeMap(() => {
        return this._apiService$.getUserAddress().pipe(
          map((userAddress) => {
            return getUserAddressSuccess({userAddress});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [getUserAddressFailure({errorResponse})];
          })
        );
      })
    );
  });
  loadSystemCurrencies$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadSystemCurrencyListAction),
      mergeMap(() => {
        return this._apiService$.loadSystemCurrencyList().pipe(
          map((systemCurrencyList) => {
            return loadSystemCurrencyListSuccess({systemCurrencyList});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadSystemCurrencyListFailure({errorResponse})];
          })
        );
      })
    );
  });
  saveUserProperty$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(saveUserPropertyAction),
      mergeMap((action) => {
        return this._apiService$.saveUserProperty(action.userProperty).pipe(
          map((userProperty) => {
            getUserPropertySuccess({userProperty});
            return saveUserPropertySuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [saveUserPropertyFailure({errorResponse})];
          })
        );
      })
    );
  });
  saveUserAddress$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(saveUserAddressAction),
      mergeMap((action) => {
        return this._apiService$.saveUserAddress(action.address).pipe(
          map((userAddress) => {
            getUserAddressSuccess({userAddress});
            return saveUserAddressSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [saveUserAddressFailure({errorResponse})];
          })
        );
      })
    );
  });
}
