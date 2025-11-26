import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {ApiService} from '../../services/api.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {inject} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {UserProperty} from '../api/model/userProperty';
import {Address} from '../api/model/address';
import {StrategyData} from './services/strategy.data';
import {SystemCurrency} from '../api/model/systemCurrency';
import {StrategiesService} from './services/strategies.service';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';

type PropertyState = {
  timezones: string[];
  locales: string[];
  userProperty: UserProperty;
  userAddress: Address;
  strategyData: StrategyData;
  systemCurrencyList: SystemCurrency[];
  isLoading: boolean;
}
export const initialPropertyState: PropertyState = {
  timezones: [],
  locales: [],
  userProperty: {} as UserProperty,
  userAddress: {} as Address,
  strategyData: {} as StrategyData,
  systemCurrencyList: [],
  isLoading: false
};

export const PropertyStore = signalStore(
  {providedIn: 'root'},
  withState(initialPropertyState),
  withMethods((store,
               strategiesService: StrategiesService = inject(StrategiesService),
               apiService = inject(ApiService),
               translateService = inject(TranslateService),
               messageService = inject(MessageService)
  ) => ({
    loadTimezoneList: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return apiService.loadTimezoneList().pipe(
            tapResponse({
              next: (timezones) => patchState(store, {timezones}),
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                });
                patchState(store, {timezones: []})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadUnicodeLocalesList: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return apiService.loadUnicodeLocalesList().pipe(
            tapResponse({
              next: (locales) => patchState(store, {locales}),
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                });
                patchState(store, {locales: []})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    getUserProperty: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return apiService.getUserProperty().pipe(
            tapResponse({
              next: (userProperty) => patchState(store, {userProperty}),
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                });
                patchState(store, {userProperty: {} as UserProperty})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    getUserAddress: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return apiService.getUserAddress().pipe(
            tapResponse({
              next: (userAddress) => patchState(store, {userAddress}),
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                });
                patchState(store, {userAddress: {} as Address})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadSystemCurrencyList: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return apiService.loadSystemCurrencyList().pipe(
            tapResponse({
              next: (systemCurrencyList) => patchState(store, {systemCurrencyList}),
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                });
                patchState(store, {systemCurrencyList: []})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadActuatorStrategyData: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return strategiesService.loadActuatorStrategyData().pipe(
            tapResponse({
              next: (strategyData) => patchState(store, {strategyData}),
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                });
                patchState(store, {strategyData: {} as StrategyData})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    saveUserProperty: rxMethod<UserProperty>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((userProperty) => {
          return apiService.saveUserProperty(userProperty).pipe(
            tapResponse({
              next: (userProperty) => {
                patchState(store, {userProperty});
              },
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.SEND') + errorResponse.message,
                });
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    saveUserAddress: rxMethod<Address>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((userAddress) => {
          return apiService.saveUserAddress(userAddress).pipe(
            tapResponse({
              next: (userAddress) => {
                patchState(store, {userAddress});
              },
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.SEND') + errorResponse.message,
                });
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    updateSystemCurrency: rxMethod<SystemCurrency>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((systemCurrency) => {
          return apiService.updateSystemCurrency(systemCurrency).pipe(
            tapResponse({
              next: (systemCurrencyList) => {
                patchState(store, {systemCurrencyList});
                // toasterService.info('Currency saved');
              },
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.SEND') + errorResponse.message,
                });
                patchState(store, {systemCurrencyList: []})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
  }))
);
