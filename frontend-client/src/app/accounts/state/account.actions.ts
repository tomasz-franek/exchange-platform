import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { UserAccount } from '../../api/model/userAccount';
import { UserOperation } from '../../api/model/userOperation';
import { AccountBalance } from '../../api/model/accountBalance';
import { AccountOperationsRequest } from '../../api/model/accountOperationsRequest';

export const loadAccountBalanceListAction = createAction(
  '[Account] LoadAccountBalanceList Action'
);
export const loadAccountBalanceListSuccess = createAction(
  '[Account] LoadAccountBalanceListSuccess',
  props<{ accountBalanceList: AccountBalance[] }>()
);
export const loadAccountBalanceListFailure = createAction(
  '[Account] LoadAccountBalanceListFailure',
  props<{
    errorResponse: HttpErrorResponse;
  }>()
);

export const saveUserAccount = createAction(
  '[Account] SaveUserAccount',
  props<{ userAccount: UserAccount }>()
);

export const saveUserAccountSuccess = createAction(
  '[Account] SaveUserAccountSuccess',
  props<{ userAccount: UserAccount }>()
);
export const saveUserAccountFailure = createAction(
  '[Account] SaveUserAccountFailure',
  props<{
    errorResponse: HttpErrorResponse;
  }>()
);

export const loadUserOperationListAction = createAction(
  '[Account] LoadUserOperationListAction',
  props<{ accountOperationsRequest: AccountOperationsRequest }>()
);

export const loadUserOperationListSuccess = createAction(
  '[Account] LoadUserOperationListSuccess',
  props<{ userOperationList: UserOperation[] }>()
);

export const loadUserOperationListFailure = createAction(
  '[Account] LoadUserOperationListFailure',
  props<{
    errorResponse: HttpErrorResponse;
  }>()
);


