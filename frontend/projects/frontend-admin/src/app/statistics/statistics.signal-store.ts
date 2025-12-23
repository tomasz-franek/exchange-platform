import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {ApiService} from '../../services/api.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {inject} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {UsersStatisticResponse} from '../api/model/usersStatisticResponse';
import {CurrencyStatisticResponse} from '../api/model/currencyStatisticResponse';
import {PairStatisticResponse} from '../api/model/pairStatisticResponse';
import {UsersStatisticRequest} from '../api/model/usersStatisticRequest';
import {Pair} from '../api/model/pair';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';

type StatisticState = {
  usersStatisticResponse: UsersStatisticResponse | null;
  currencyStatisticResponse: CurrencyStatisticResponse | null;
  pairStatisticResponse: PairStatisticResponse | null;

  isLoading: boolean;
};
export const initialStatisticState: StatisticState = {
  usersStatisticResponse: null,
  currencyStatisticResponse: null,
  pairStatisticResponse: null,
  isLoading: false,
};

export const StatisticStore = signalStore(
  {providedIn: 'root'},
  withState(initialStatisticState),
  withMethods(
    (
      store,
      apiService = inject(ApiService),
      translateService = inject(TranslateService),
      messageService = inject(MessageService),
    ) => ({
      loadUserStatistic: rxMethod<UsersStatisticRequest>(
        pipe(
          tap(() => patchState(store, {isLoading: true})),
          switchMap((usersStatisticRequest) => {
            return apiService.loadUsersStatistic(usersStatisticRequest).pipe(
              tapResponse({
                next: (usersStatisticResponse) =>
                  patchState(store, {usersStatisticResponse}),
                error: (errorResponse: HttpErrorResponse) => {
                  messageService.add({
                    severity: 'error',
                    detail:
                      translateService.instant('ERRORS.LOAD') +
                      errorResponse.message,
                  });
                  patchState(store, {
                    usersStatisticResponse: {} as UsersStatisticResponse,
                  });
                },
                finalize: () => patchState(store, {isLoading: false}),
              }),
            );
          }),
        ),
      ),
      loadCurrencyStatistics: rxMethod<string>(
        pipe(
          tap(() => patchState(store, {isLoading: true})),
          switchMap((currency) => {
            return apiService.loadCurrencyStatistics(currency).pipe(
              tapResponse({
                next: (currencyStatisticResponse) =>
                  patchState(store, {currencyStatisticResponse}),
                error: (errorResponse: HttpErrorResponse) => {
                  messageService.add({
                    severity: 'error',
                    detail:
                      translateService.instant('ERRORS.LOAD') +
                      errorResponse.message,
                  });
                  patchState(store, {
                    currencyStatisticResponse: {} as CurrencyStatisticResponse,
                  });
                },
                finalize: () => patchState(store, {isLoading: false}),
              }),
            );
          }),
        ),
      ),
      loadPairStatistics: rxMethod<Pair>(
        pipe(
          tap(() => patchState(store, {isLoading: true})),
          switchMap((pair) => {
            return apiService.loadPairStatistics(pair).pipe(
              tapResponse({
                next: (pairStatisticResponse) =>
                  patchState(store, {pairStatisticResponse}),
                error: (errorResponse: HttpErrorResponse) => {
                  messageService.add({
                    severity: 'error',
                    detail:
                      translateService.instant('ERRORS.LOAD') +
                      errorResponse.message,
                  });
                  patchState(store, {
                    pairStatisticResponse: {} as PairStatisticResponse,
                  });
                },
                finalize: () => patchState(store, {isLoading: false}),
              }),
            );
          }),
        ),
      ),
    }),
  ),
);
