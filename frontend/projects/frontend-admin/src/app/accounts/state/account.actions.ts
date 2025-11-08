import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { UserAccount } from '../../api/model/userAccount';
import { UserAccountRequest } from '../../api/model/userAccountRequest';
import { UserAccountOperation } from '../../api/model/userAccountOperation';
import { LoadUserRequest } from '../../api/model/loadUserRequest';
import { UserData } from '../../api/model/userData';
import { AccountOperation } from '../../api/model/accountOperation';
import { AccountOperationsRequest } from '../../api/model/accountOperationsRequest';
import { AccountAmountRequest } from '../../api/model/accountAmountRequest';
import { AccountAmountResponse } from '../../api/model/accountAmountResponse';
import { UserBankAccountRequest } from '../../api/model/userBankAccountRequest';
import { UserBankAccount } from '../../api/model/userBankAccount';

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
  props<{ accountType: string }>(),
);

export const loadSystemAccountListSuccess = createAction(
  '[Account] Load System Account List Success',
  props<{ systemAccounts: UserAccount[] }>(),
);

export const loadSystemAccountListFailure = createAction(
  '[Account] Load System Account List Failure',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const loadAccountOperationListAction = createAction(
  '[Account] Load Account Operation List',
  props<{ loadAccountOperationsRequest: AccountOperationsRequest }>(),
);

export const loadAccountOperationListSuccess = createAction(
  '[Account] Load Account Operation List Success',
  props<{ accountOperations: AccountOperation[] }>(),
);

export const loadAccountOperationListFailure = createAction(
  '[Account] Load Account Operation List Failure',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const loadOperationPdfDocumentAction = createAction(
  '[Account] Load Operation PDF Document',
  props<{ loadAccountOperationsRequest: AccountOperationsRequest }>(),
);
export const loadOperationPdfDocumentSuccess = createAction(
  '[Account] Load Operation PDF Document Success',
);
export const loadOperationPdfDocumentFailure = createAction(
  '[Account] Load  Operation PDF Document Failure',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const loadAccountAmountAction = createAction(
  '[Account] Load Account Amount',
  props<{ request: AccountAmountRequest }>(),
);
export const loadAccountAmountSuccess = createAction(
  '[Account] Load Account Amount Success',
  props<{ accountAmountResponse: AccountAmountResponse }>(),
);
export const loadAccountAmountFailure = createAction(
  '[Account] Load Account Amount Failure',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const validateUserBankAccountAction = createAction(
  '[Account] Validate User Bank Account Action',
  props<{ userBankAccount: UserBankAccount }>(),
);
export const validateUserBankAccountSuccess = createAction(
  '[Account] Validate User Bank Account Success',
);
export const validateUserBankAccountFailure = createAction(
  '[Account] Validate User Bank Account Failure',
  props<{ errorResponse: HttpErrorResponse }>(),
);

export const loadBankAccountListAction = createAction(
  '[Account] Load Bank Account List Action',
  props<{ userBankAccountRequest: UserBankAccountRequest }>(),
);

export const loadBankAccountListSuccess = createAction(
  '[Account] Load Bank Account List Success',
  props<{ userBankAccounts: UserBankAccount[] }>(),
);

export const loadBankAccountListFailure = createAction(
  '[Account] Load Bank Account List Failure',
  props<{ errorResponse: HttpErrorResponse }>(),
);
