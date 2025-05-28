import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountBalance, UserAccountOperation } from '../../api';
import { UserAccount } from '../../api/model/userAccount';

export const saveDeposit = createAction(
  '[Account] SaveDeposit',
  props<{ depositRequest: UserAccountOperation }>(),
);

export const saveDepositSuccess = createAction('[Account] SaveDepositSuccess');
export const saveDepositFailure = createAction(
  '[Account] SaveDepositFailure',
  props<{
    error: HttpErrorResponse;
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
    error: HttpErrorResponse;
  }>(),
);

export const loadAccountBalanceListAction = createAction(
  '[Account] LoadAccountBalanceList Action',
  props<{ userId: string }>(),
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
