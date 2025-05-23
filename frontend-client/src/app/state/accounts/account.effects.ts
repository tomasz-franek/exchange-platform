import { inject, Injectable } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AccountEffects {
  private _apiService$: ApiService = inject(ApiService);
  private toasterService: ToastrService = inject(ToastrService);

  sendDeposit$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(sendDepositRequest),
      mergeMap((action) => {
        return this._apiService$.addAccountDeposit(action.depositRequest).pipe(
          map(() => {
            this.toasterService.info('Deposit successfully sent');
            return sendDepositSuccess();
          }),
          catchError((error: any) => {
            this.toasterService.error(
              'Error occurred while saving deposit request',
            );
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
              this.toasterService.info('Withdraw request successfully sent');
              return sendWithdrawSuccess();
            }),
            catchError((error: any) => {
              this.toasterService.error(
                'Error occurred while sending withdraw request',
              );
              return [sendWithdrawFailure({ error })];
            }),
          );
      }),
    ),
  );

  listUserAccount$ = createEffect(() =>
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
