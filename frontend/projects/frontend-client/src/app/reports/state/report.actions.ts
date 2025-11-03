import { createAction, props } from '@ngrx/store';
import { FinancialReportRequest } from '../../api';
import { HttpErrorResponse } from '@angular/common/http';

export const loadFinancialReportPdfDocumentAction = createAction(
  '[Reports] Load Financial Report Document Action',
  props<{ financialReportRequest: FinancialReportRequest }>()
);

export const loadFinancialReportPdfDocumentSuccess = createAction(
  '[Reports] Load Financial Report Document Success'
);

export const loadFinancialReportPdfDocumentFailure = createAction(
  '[Reports] Load Financial Report Document Failure',
  props<{ errorResponse: HttpErrorResponse }>()
);
