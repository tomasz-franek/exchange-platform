import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { UserAccount } from '../../api/model/userAccount';
import { UserAccountRequest } from '../../api/model/userAccountRequest';
import { UserAccountOperation } from '../../api/model/userAccountOperation';
import { LoadUserRequest } from '../../api/model/loadUserRequest';
import { UserData } from '../../api/model/userData';
import { SystemAccountOperation } from '../../api/model/systemAccountOperation';
import { SystemAccountOperationsRequest } from '../../api/model/systemAccountOperationsRequest';

export const loadAccountListAction = createAction(
  '[Account] Load user account list',
  props<{ userAccountRequest: UserAccountRequest }>(),
);
export const loadAccountListSuccess = createAction(
  '[Account] Load user account list success',
  props<{ userAccounts: UserAccount[] }>(),
);
export const loadAccountListFailure = createAction(
  '[Account] Load user account list failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);

export const saveDeposit = createAction(
  '[Account] SaveDeposit',
  props<{ depositRequest: UserAccountOperation }>(),
);

export const saveDepositSuccess = createAction('[Account] SaveDepositSuccess');
export const saveDepositFailure = createAction(
  '[Account] SaveDepositFailure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);

export const saveWithdraw = createAction(
  '[Account] SaveDepositWithdraw',
  props<{ withdrawRequest: UserAccountOperation }>(),
);
export const saveWithdrawSuccess = createAction(
  '[Account] SaveWithdrawSuccess',
);
export const saveWithdrawFailure = createAction(
  '[Account] SaveWithdrawFailure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);

export const loadUserListAction = createAction(
  '[Account] Load User List',
  props<{ loadUserRequest: LoadUserRequest }>(),
);

export const loadUserListActionSuccess = createAction(
  '[Account] Load User List Success',
  props<{ users: UserData[] }>(),
);

export const loadUserListActionFailure = createAction(
  '[Account] Load User List Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);

export const loadSystemAccountListAction = createAction(
  '[Account] Load System Account List',
);

export const loadSystemAccountListSuccess = createAction(
  '[Account] Load System Account List Success',
  props<{ systemAccounts: UserAccount[] }>(),
);

export const loadSystemAccountListFailure = createAction(
  '[Account] Load System Account List Failure',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const loadSystemAccountOperationListAction = createAction(
  '[Account] Load System Account Operation List',
  props<{ loadAccountOperationsRequest: SystemAccountOperationsRequest }>(),
);

export const loadSystemAccountOperationListSuccess = createAction(
  '[Account] Load System Account Operation List Success',
  props<{ systemAccountOperations: SystemAccountOperation[] }>(),
);

export const loadSystemAccountOperationListFailure = createAction(
  '[Account] Load System Account Operation List Failure',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const loadSystemOperationPdfDocumentAction = createAction(
  '[Account] Load System Operation PDF Document',
  props<{ loadAccountOperationsRequest: SystemAccountOperationsRequest }>(),
);
export const loadSystemOperationPdfDocumentSuccess = createAction(
  '[Account] Load System Operation PDF Document Success',
);
export const loadSystemOperationPdfDocumentFailure = createAction(
  '[Account] Load System Operation PDF Document Failure',
  props<{ errorResponse: HttpErrorResponse }>(),
);
