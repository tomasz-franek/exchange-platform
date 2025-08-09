import {inject, Injectable} from '@angular/core';
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
  loadTimezoneListAction,
  loadTimezoneListFailure,
  loadTimezoneListSuccess,
  saveUserAddressAction,
  saveUserAddressFailure,
  saveUserAddressSuccess,
  saveUserPropertyAction,
  saveUserPropertyFailure,
  saveUserPropertySuccess,
} from './properties.actions';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiService} from '../../../services/api.service';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class PropertiesEffects {
  private _apiService$: ApiService = inject(ApiService);
  private readonly toasterService: ToastrService = inject(ToastrService);

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
            return loadLocaleListSuccess({locales: data});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadLocaleListFailure({errorResponse})];
          }),
        );
      }),
    );
  });

  saveUserProperty$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(saveUserPropertyAction),
      mergeMap((action) => {
        return this._apiService$.saveUserProperty(action.userProperty).pipe(
          map((userProperty) => {
            this.toasterService.info('Property saved');
            getUserPropertySuccess({userProperty});
            return saveUserPropertySuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toasterService.error(
              'Error occurred while saving user property',
            );
            return [saveUserPropertyFailure({errorResponse})];
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
            return getUserPropertySuccess({userProperty});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [getUserPropertyFailure({errorResponse})];
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
            return getUserAddressSuccess({userAddress});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [getUserAddressFailure({errorResponse})];
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
            getUserAddressSuccess({userAddress});
            return saveUserAddressSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toasterService.error(
              'Error occurred while saving user address',
            );
            return [saveUserAddressFailure({errorResponse})];
          }),
        );
      }),
    );
  });
}
