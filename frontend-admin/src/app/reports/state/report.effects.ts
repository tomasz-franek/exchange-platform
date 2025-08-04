import {inject, Injectable} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap} from 'rxjs';
import {
  generateAccountsReportAction,
  generateAccountsReportFailure,
  generateAccountsReportSuccess
} from './report.actions';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class ReportEffects {
  private readonly _apiService$: ApiService = inject(ApiService);

  loadAccountsReport$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(generateAccountsReportAction),
      mergeMap((action) => {
        return this._apiService$.generateAccountsReport(action.accountsReportRequest).pipe(
          map((accountsReportResponse) => {
            return generateAccountsReportSuccess({accountsReportResponse});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [generateAccountsReportFailure({errorResponse})];
          }),
        );
      }),
    );
  });
}
