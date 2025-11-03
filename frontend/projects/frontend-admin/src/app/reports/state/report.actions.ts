import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountsReportRequest } from '../../api/model/accountsReportRequest';
import { AccountsReportResponse } from '../../api/model/accountsReportResponse';
import { ErrorMessage } from '../../api/model/errorMessage';
import { ErrorListRequest } from '../../api/model/errorListRequest';

export const generateAccountsReportAction = createAction(
  '[Reports] Generate Accounts Report',
  props<{ accountsReportRequest: AccountsReportRequest }>(),
);
export const generateAccountsReportSuccess = createAction(
  '[Reports] Generate Accounts Report Success',
  props<{ accountsReportResponse: AccountsReportResponse[] }>(),
);
export const generateAccountsReportFailure = createAction(
  '[Reports] Generate Accounts Report Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);

export const loadErrorListAction = createAction(
  '[Reports] Load Error List Action',
  props<{ errorListRequest: ErrorListRequest }>(),
);
export const loadErrorListSuccess = createAction(
  '[Reports] Load Error List Success',
  props<{ errorMessageList: ErrorMessage[] }>(),
);
export const loadErrorListFailure = createAction(
  '[Reports] Load Error List Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);

export const deleteErrorAction = createAction(
  '[Reports] Delete Error',
  props<{ id: number }>(),
);
export const deleteErrorSuccess = createAction(
  '[Reports] Delete Error Success',
);
export const deleteErrorFailure = createAction(
  '[Reports] Delete Error Failure',
  props<{ errorResponse: HttpErrorResponse }>(),
);
