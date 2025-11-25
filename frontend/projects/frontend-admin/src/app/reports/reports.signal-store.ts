import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {ApiService} from '../../services/api.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {debounceTime, distinctUntilChanged, pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {inject} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {AccountsReportResponse} from '../api/model/accountsReportResponse';
import {ErrorMessage} from '../api/model/errorMessage';
import {AccountsReportRequest} from '../api/model/accountsReportRequest';
import {ErrorListRequest} from '../api/model/errorListRequest';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';

type ReportState = {
  accountsReportResponse: AccountsReportResponse[];
  errorMessageList: ErrorMessage[];
  isLoading: boolean;
}
export const initialReportState: ReportState = {
  accountsReportResponse: [],
  errorMessageList: [],
  isLoading: false
};

export const ReportStore = signalStore(
  {providedIn: 'root'},
  withState(initialReportState),
  withMethods((store,
               apiService = inject(ApiService),
               translateService = inject(TranslateService),
               messageService = inject(MessageService)
  ) => ({
    generateAccountsReport: rxMethod<AccountsReportRequest>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap((accountsReportRequest) => {
          return apiService.generateAccountsReport(accountsReportRequest).pipe(
            tapResponse({
              next: (accountsReportResponse) => patchState(store, {accountsReportResponse}),
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                });
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadErrorList: rxMethod<ErrorListRequest>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap((errorListRequest) => {
          return apiService.loadErrorList(errorListRequest).pipe(
            tapResponse({
              next: (errorMessageList) => patchState(store, {errorMessageList}),
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                });
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    deleteError: rxMethod<number>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap((id) => {
          return apiService.deleteError(id).pipe(
            tapResponse({
              next: (errorMessageList) => patchState(store, {
                errorMessageList: errorMessageList,
              }),
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
  }))
);
