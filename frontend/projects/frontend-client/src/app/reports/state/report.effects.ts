import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import {
  loadFinancialReportPdfDocumentAction,
  loadFinancialReportPdfDocumentFailure,
  loadFinancialReportPdfDocumentSuccess
} from './report.actions';

@Injectable()
export class ReportEffects {
  private _apiService$: ApiService = inject(ApiService);

  loadFinancialReportPdfDocument$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadFinancialReportPdfDocumentAction),
      mergeMap((action) => {
        return this._apiService$.loadFinancialReportPdfDocument(action.financialReportRequest).pipe(
          map((data) => {
            const file = new Blob([data], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL);
            return loadFinancialReportPdfDocumentSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadFinancialReportPdfDocumentFailure({ errorResponse })];
          })
        );
      })
    );
  });
}
