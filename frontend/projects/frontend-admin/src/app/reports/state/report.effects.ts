import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs';
import {
  deleteErrorAction,
  deleteErrorFailure,
  deleteErrorSuccess,
  generateAccountsReportAction,
  generateAccountsReportFailure,
  generateAccountsReportSuccess,
  loadErrorListAction,
  loadErrorListFailure,
  loadErrorListSuccess,
} from './report.actions';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ReportEffects {
  private readonly _apiService$: ApiService = inject(ApiService);

  loadAccountsReport$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(generateAccountsReportAction),
      mergeMap((action) => {
        return this._apiService$
          .generateAccountsReport(action.accountsReportRequest)
          .pipe(
            map((accountsReportResponse) => {
              return generateAccountsReportSuccess({ accountsReportResponse });
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return [generateAccountsReportFailure({ errorResponse })];
            }),
          );
      }),
    );
  });

  loadErrorList$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadErrorListAction),
      mergeMap((action) => {
        return this._apiService$.loadErrorList(action.errorListRequest).pipe(
          map((errorMessageList) => {
            return loadErrorListSuccess({ errorMessageList });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadErrorListFailure({ errorResponse })];
          }),
        );
      }),
    );
  });

  deleteError$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(deleteErrorAction),
      mergeMap((action) => {
        return this._apiService$.deleteError(action.id).pipe(
          mergeMap((errorMessageList) => {
            return [
              deleteErrorSuccess(),
              loadErrorListAction({ errorListRequest: { offset: 0 } }),
            ];
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [deleteErrorFailure({ errorResponse })];
          }),
        );
      }),
    );
  });
}
