import {createAction, props} from '@ngrx/store';
import {HttpErrorResponse} from '@angular/common/http';
import {UserAccount} from '../../api/model/userAccount';
import {UserAccountRequest} from '../../api/model/userAccountRequest';
import {
  UserAccountOperation
} from "../../../../../frontend-client/src/app/api/model/userAccountOperation";

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
      error: HttpErrorResponse;
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

