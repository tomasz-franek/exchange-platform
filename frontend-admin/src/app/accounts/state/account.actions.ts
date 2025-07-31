import {createAction, props} from '@ngrx/store';
import {HttpErrorResponse} from '@angular/common/http';
import {UserAccount} from '../../api/model/userAccount';
import {UserAccountRequest} from '../../api/model/userAccountRequest';
import {UserAccountOperation} from '../../api/model/userAccountOperation';
import {LoadUserRequest} from '../../api/model/loadUserRequest';
import {UserData} from '../../api/model/userData';

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
)

export const loadUserListActionSuccess = createAction(
  '[Account] Load User List Success',
  props<{ users: UserData[] }>(),
)

export const loadUserListActionFailure = createAction(
  '[Account] Load User List Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
)

