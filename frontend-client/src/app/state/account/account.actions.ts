import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { UserAccount } from '../../api/model/userAccount';
import { UserOperation } from '../../api/model/userOperation';
import { AccountBalance } from '../../api/model/accountBalance';
import { AccountOperationsRequest } from '../../api/model/accountOperationsRequest';
import { UserProperty } from '../../api/model/userProperty';

export const loadAccountBalanceListAction = createAction(
  '[Account] LoadAccountBalanceList Action',
);
export const loadAccountBalanceListSuccess = createAction(
  '[Account] LoadAccountBalanceListSuccess',
  props<{ accountBalanceList: AccountBalance[] }>(),
);
export const loadAccountBalanceListFailure = createAction(
  '[Account] LoadAccountBalanceListFailure',
  props<{
    error: HttpErrorResponse;
  }>(),
);

export const saveUserAccount = createAction(
  '[Account] SaveUserAccount',
  props<{ userAccount: UserAccount }>(),
);

export const saveUserAccountSuccess = createAction(
  '[Account] SaveUserAccountSuccess',
  props<{ userAccount: UserAccount }>(),
);
export const saveUserAccountFailure = createAction(
  '[Account] SaveUserAccountFailure',
  props<{
    error: HttpErrorResponse;
  }>(),
);

export const loadUserOperationListAction = createAction(
  '[Account] LoadUserOperationListAction',
  props<{ accountOperationsRequest: AccountOperationsRequest }>(),
);

export const loadUserOperationListSuccess = createAction(
  '[Account] LoadUserOperationListSuccess',
  props<{ userOperationList: UserOperation[] }>(),
);

export const loadUserOperationListFailure = createAction(
  '[Account] LoadUserOperationListFailure',
  props<{
    error: HttpErrorResponse;
  }>(),
);

export const getUserPropertyAction = createAction(
  '[Account] GetUserProperty Action',
);

export const getUserPropertySuccess = createAction(
  '[Account] GetUserPropertySuccess',
  props<{ userProperty: UserProperty }>(),
);

export const getUserPropertyFailure = createAction(
  '[Account] GetUserPropertyFailure',
  props<{
    error: HttpErrorResponse;
  }>(),
);

export const saveUserPropertyAction = createAction(
  '[Account] SaveUserPropertyAction',
  props<{ userProperty: UserProperty }>(),
);

export const saveUserPropertySuccess = createAction(
  '[Account] SaveUserPropertySuccess',
);

export const saveUserPropertyFailure = createAction(
  '[Account] SaveUserPropertyFailure',
  props<{
    error: HttpErrorResponse;
  }>(),
);
