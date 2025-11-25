import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {debounceTime, distinctUntilChanged, pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {inject} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiService} from '../../services/api/api.service';
import {FinancialReportRequest} from '../api';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';

type ReportState = {
  isLoading: boolean;
}
export const reportState: ReportState = {
  isLoading: false
};

export const ReportStore = signalStore(
  {providedIn: 'root'},
  withState(reportState),
  withMethods((store,
               apiService = inject(ApiService),
               translateService = inject(TranslateService),
               messageService = inject(MessageService)
  ) => ({
    loadFinancialReportPdfDocument: rxMethod<FinancialReportRequest>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap((financialReportRequest) => {
          return apiService.loadFinancialReportPdfDocument(financialReportRequest).pipe(
            tapResponse({
              next: (data) => {
                const file = new Blob([data], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
              },
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
  }))
);
