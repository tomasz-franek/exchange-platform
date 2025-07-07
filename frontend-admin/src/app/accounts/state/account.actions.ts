import {createAction, props} from '@ngrx/store';
import {HttpErrorResponse} from '@angular/common/http';
import {UserAccount} from '../../api/model/userAccount';
import {UserAccountRequest} from '../../api/model/userAccountRequest';

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
