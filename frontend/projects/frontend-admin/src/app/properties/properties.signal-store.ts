import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {ApiService} from '../../services/api.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {debounceTime, distinctUntilChanged, pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {inject} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {UserProperty} from '../api/model/userProperty';
import {Address} from '../api/model/address';
import {StrategyData} from './services/strategy.data';
import {SystemCurrency} from '../api/model/systemCurrency';
import {StrategiesService} from './services/strategies.service';
import {ToastrService} from 'ngx-toastr';

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

export const propertyStore = signalStore(
  {providedIn: 'root'},
  withState(initialPropertyState),
  withMethods((store,
               apiService = inject(ApiService),
               strategiesService: StrategiesService = inject(StrategiesService),
               toasterService: ToastrService = inject(ToastrService)
  ) => ({
    loadTimezoneList: rxMethod<void>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return apiService.loadTimezoneList().pipe(
            tapResponse({
              next: (timezones) => patchState(store, {timezones}),
              error: (error: HttpErrorResponse) => console.log(error.message),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadUnicodeLocalesList: rxMethod<void>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return apiService.loadUnicodeLocalesList().pipe(
            tapResponse({
              next: (locales) => patchState(store, {locales}),
              error: (error: HttpErrorResponse) => console.log(error.message),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    getUserProperty: rxMethod<void>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return apiService.getUserProperty().pipe(
            tapResponse({
              next: (userProperty) => patchState(store, {userProperty}),
              error: (error: HttpErrorResponse) => console.log(error.message),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    getUserAddress: rxMethod<void>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return apiService.getUserAddress().pipe(
            tapResponse({
              next: (userAddress) => patchState(store, {userAddress}),
              error: (error: HttpErrorResponse) => console.log(error.message),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadSystemCurrencyList: rxMethod<void>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return apiService.loadSystemCurrencyList().pipe(
            tapResponse({
              next: (systemCurrencyList) => patchState(store, {systemCurrencyList}),
              error: (error: HttpErrorResponse) => console.log(error.message),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadActuatorStrategyData: rxMethod<void>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return strategiesService.loadActuatorStrategyData().pipe(
            tapResponse({
              next: (strategyData) => patchState(store, {strategyData}),
              error: (error: HttpErrorResponse) => console.log(error.message),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    saveUserProperty: rxMethod<UserProperty>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap((userProperty) => {
          return apiService.saveUserProperty(userProperty).pipe(
            tapResponse({
              next: (userProperty) => {
                patchState(store, {userProperty});
                toasterService.info('Property saved');
              },
              error: (error: HttpErrorResponse) => {
                console.log(error.message);
                toasterService.error(
                  'Error occurred while saving user property',
                );
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    saveUserAddress: rxMethod<Address>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap((userAddress) => {
          return apiService.saveUserAddress(userAddress).pipe(
            tapResponse({
              next: (userAddress) => {
                patchState(store, {userAddress});
                toasterService.info('Address saved');
              },
              error: (error: HttpErrorResponse) => {
                console.log(error.message);
                toasterService.error(
                  'Error occurred while saving user address',
                );
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    updateSystemCurrency: rxMethod<SystemCurrency>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap((systemCurrency) => {
          return apiService.updateSystemCurrency(systemCurrency).pipe(
            tapResponse({
              next: (userAddress) => {
                patchState(store, {userAddress});
                toasterService.info('Currency saved');
              },
              error: (error: HttpErrorResponse) => {
                console.log(error.message);
                toasterService.error(
                  'Error occurred while saving Currency',
                );
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
  }))
);
