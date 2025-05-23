import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountBalance, UserAccountOperation } from '../../api';
import { UserAccount } from '../../api/model/userAccount';

export const sendDepositRequest = createAction(
  '[Account] SendDepositRequest',
  props<{ depositRequest: UserAccountOperation }>(),
);

export const sendDepositSuccess = createAction('[Account] SendDepositSuccess');
export const sendDepositFailure = createAction(
  '[Account] SendDepositFailure',
  props<{
    error: HttpErrorResponse;
  }>(),
);

export const sendWithdrawRequest = createAction(
  '[Account] SendDepositWithdrawRequest',
  props<{ withdrawRequest: UserAccountOperation }>(),
);
export const sendWithdrawSuccess = createAction(
  '[Account] SendWithdrawSuccess',
);
export const sendWithdrawFailure = createAction(
  '[Account] SendWithdrawFailure',
  props<{
    error: HttpErrorResponse;
  }>(),
);

export const getUserAccountList = createAction(
  '[Account] GetUserAccountList',
  props<{ userId: string }>(),
);
export const getUserAccountListSuccess = createAction(
  '[Account] GetUserAccountListSuccess',
  props<{ accountBalance: AccountBalance[] }>(),
);
export const getUserAccountListFailure = createAction(
  '[Account] GetUserAccountListFailure',
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
