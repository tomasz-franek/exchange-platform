import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ApiService } from '../../services/api.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountsReportResponse } from '../api/model/accountsReportResponse';
import { ErrorMessage } from '../api/model/errorMessage';
import { AccountsReportRequest } from '../api/model/accountsReportRequest';
import { ErrorListRequest } from '../api/model/errorListRequest';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { TransactionsPdfRequest } from '../api/model/transactionsPdfRequest';
import { AccountOperationsRequest } from '../api/model/accountOperationsRequest';

type ReportState = {
  accountsReportResponse: AccountsReportResponse[];
  errorMessageList: ErrorMessage[];
  isLoading: boolean;
};
export const initialReportState: ReportState = {
  accountsReportResponse: [],
  errorMessageList: [],
  isLoading: false,
};

export const ReportStore = signalStore(
  { providedIn: 'root' },
  withState(initialReportState),
  withMethods(
    (
      store,
      apiService = inject(ApiService),
      translateService = inject(TranslateService),
      messageService = inject(MessageService),
    ) => ({
      generateAccountsReport: rxMethod<AccountsReportRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((accountsReportRequest) => {
            return apiService
              .generateAccountsReport(accountsReportRequest)
              .pipe(
                tapResponse({
                  next: (accountsReportResponse) =>
                    patchState(store, { accountsReportResponse }),
                  error: (errorResponse: HttpErrorResponse) => {
                    messageService.add({
                      severity: 'error',
                      detail:
                        translateService.instant('ERRORS.LOAD') +
                        errorResponse.message,
                    });
                    patchState(store, { accountsReportResponse: [] });
                  },
                  finalize: () => patchState(store, { isLoading: false }),
                }),
              );
          }),
        ),
      ),
      loadErrorList: rxMethod<ErrorListRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((errorListRequest) => {
            return apiService.loadErrorList(errorListRequest).pipe(
              tapResponse({
                next: (errorMessageList) =>
                  patchState(store, { errorMessageList }),
                error: (errorResponse: HttpErrorResponse) => {
                  messageService.add({
                    severity: 'error',
                    detail:
                      translateService.instant('ERRORS.LOAD') +
                      errorResponse.message,
                  });
                  patchState(store, { errorMessageList: [] });
                },
                finalize: () => patchState(store, { isLoading: false }),
              }),
            );
          }),
        ),
      ),
      deleteError: rxMethod<number>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((id) => {
            return apiService.deleteError(id).pipe(
              tapResponse({
                next: (errorMessageList) =>
                  patchState(store, {
                    errorMessageList: errorMessageList,
                  }),
                error: (errorResponse: HttpErrorResponse) => {
                  messageService.add({
                    severity: 'error',
                    detail:
                      translateService.instant('ERRORS.SEND') +
                      errorResponse.message,
                  });
                  patchState(store, { errorMessageList: [] });
                },
                finalize: () => patchState(store, { isLoading: false }),
              }),
            );
          }),
        ),
      ),
      loadTransactionsPdfDocument: rxMethod<TransactionsPdfRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((financialReportRequest) => {
            return apiService
              .loadTransactionsPdfDocument(financialReportRequest)
              .pipe(
                tapResponse({
                  next: (data) => {
                    const file = new Blob([data], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                  },
                  error: (errorResponse: HttpErrorResponse) => {
                    messageService.add({
                      severity: 'error',
                      detail:
                        translateService.instant('ERRORS.LOAD') +
                        errorResponse.message,
                    });
                  },
                  finalize: () => patchState(store, { isLoading: false }),
                }),
              );
          }),
        ),
      ),
      loadOperationPdfDocument: rxMethod<AccountOperationsRequest>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((loadAccountOperationsRequest) => {
            return apiService
              .loadOperationPdfDocument(loadAccountOperationsRequest)
              .pipe(
                tapResponse({
                  next: (data) => {
                    const file = new Blob([data], { type: 'application/pdf' });
                    const fileURL = URL.createObjectURL(file);
                    window.open(fileURL);
                  },
                  error: (errorResponse: HttpErrorResponse) => {
                    messageService.add({
                      severity: 'error',
                      detail:
                        translateService.instant('ERRORS.LOAD') +
                        errorResponse.message,
                    });
                  },
                  finalize: () => patchState(store, { isLoading: false }),
                }),
              );
          }),
        ),
      ),
    }),
  ),
);
