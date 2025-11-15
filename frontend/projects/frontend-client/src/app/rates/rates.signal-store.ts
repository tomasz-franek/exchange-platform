import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {debounceTime, distinctUntilChanged, pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {inject} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {ApiService} from '../../services/api/api.service';
import {CurrencyRate} from '../api/model/currencyRate';

type RatesState = {
  currencyRates: CurrencyRate[];
  isLoading: boolean;
}
export const initialRatesState: RatesState = {
  currencyRates: [],
  isLoading: false
};

export const ratesStore = signalStore(
  {providedIn: 'root'},
  withState(initialRatesState),
  withMethods((store,
               apiService = inject(ApiService),
               toasterService: ToastrService = inject(ToastrService)
  ) => ({
    loadCurrencyRates: rxMethod<void>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return apiService.loadCurrencyRates().pipe(
            tapResponse({
              next: (currencyRates) => patchState(store, {currencyRates}),
              error: (error: HttpErrorResponse) => console.log(error.message),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
  }))
);
