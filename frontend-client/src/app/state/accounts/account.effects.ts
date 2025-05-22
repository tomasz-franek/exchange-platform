import { inject } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  getUserAccountList,
  getUserAccountListFailure,
  getUserAccountListSuccess,
  sendDepositFailure,
  sendDepositRequest,
  sendDepositSuccess,
  sendWithdrawFailure,
  sendWithdrawRequest,
  sendWithdrawSuccess,
} from './account.actions';
import { catchError, map, mergeMap } from 'rxjs';

export class AccountEffects {
  private _apiService$: ApiService = inject(ApiService);

  sendDeposit$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(sendDepositRequest),
      mergeMap((action) => {
        return this._apiService$.addAccountDeposit(action.depositRequest).pipe(
          map(() => {
            return sendDepositSuccess();
          }),
          catchError((error: any) => {
            return [sendDepositFailure({ error })];
          }),
        );
      }),
    ),
  );

  sendWithdraw$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(sendWithdrawRequest),
      mergeMap((action) => {
        return this._apiService$
          .addWithdrawRequest(action.withdrawRequest)
          .pipe(
            map(() => {
              return sendWithdrawSuccess();
            }),
            catchError((error: any) => {
              return [sendWithdrawFailure({ error })];
            }),
          );
      }),
    ),
  );

  userAccountList$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(getUserAccountList),
      mergeMap((action) => {
        return this._apiService$.getUserAccountList(action.userId).pipe(
          map((data) => {
            return getUserAccountListSuccess({ accountBalance: data });
          }),
          catchError((error: any) => {
            return [getUserAccountListFailure({ error })];
          }),
        );
      }),
    ),
  );
}
