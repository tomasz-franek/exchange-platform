import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadUserAccountList,
  loadUserAccountListFailure,
  loadUserAccountListSuccess,
  saveDeposit,
  saveDepositFailure,
  saveDepositSuccess,
  saveUserAccount,
  saveUserAccountFailure,
  saveUserAccountSuccess,
  saveWithdraw,
  saveWithdrawFailure,
  saveWithdrawSuccess,
} from './account.action';
import { catchError, map, mergeMap, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UserAccount } from '../../api/model/userAccount';

@Injectable()
export class AccountEffects {
  private _apiService$: ApiService = inject(ApiService);
  private toasterService: ToastrService = inject(ToastrService);

  saveDeposit$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(saveDeposit),
      mergeMap((action) => {
        return this._apiService$.saveAccountDeposit(action.depositRequest).pipe(
          map(() => {
            this.toasterService.info('Deposit successfully sent');
            return saveDepositSuccess();
          }),
          catchError((error: any) => {
            this.toasterService.error(
              'Error occurred while saving deposit request',
            );
            return [saveDepositFailure({ error })];
          }),
        );
      }),
    ),
  );

  saveWithdraw$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(saveWithdraw),
      mergeMap((action) => {
        return this._apiService$
          .saveWithdrawRequest(action.withdrawRequest)
          .pipe(
            map(() => {
              this.toasterService.info('Withdraw request successfully sent');
              return saveWithdrawSuccess();
            }),
            catchError((error: any) => {
              this.toasterService.error(
                'Error occurred while sending withdraw request',
              );
              return [saveWithdrawFailure({ error })];
            }),
          );
      }),
    ),
  );

  listUserAccount$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(loadUserAccountList),
      mergeMap((action) => {
        return this._apiService$.loadUserAccountList(action.userId).pipe(
          map((data) => {
            return loadUserAccountListSuccess({ accountBalanceList: data });
          }),
          catchError((error: any) => {
            return [loadUserAccountListFailure({ error })];
          }),
        );
      }),
    ),
  );

  saveAccount$ = createEffect(() =>
    inject(Actions).pipe(
      ofType(saveUserAccount),
      mergeMap((action) => {
        return this._getCreateOrUpdateObservable(action.userAccount).pipe(
          map((data) => {
            return saveUserAccountSuccess({ userAccount: data });
          }),
          catchError((error: any) => {
            return [saveUserAccountFailure({ error })];
          }),
        );
      }),
    ),
  );

  private _getCreateOrUpdateObservable(
    userAccount: UserAccount,
  ): Observable<any> {
    if (userAccount.id !== undefined && userAccount.id !== null) {
      return this._apiService$.updateUserAccount(userAccount.id, userAccount);
    }
    return this._apiService$.createUserAccount(userAccount);
  }
}
