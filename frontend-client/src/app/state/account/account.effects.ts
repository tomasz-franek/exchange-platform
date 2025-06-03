import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadAccountBalanceListAction,
  loadAccountBalanceListFailure,
  loadAccountBalanceListSuccess,
  loadUserOperationListAction,
  loadUserOperationListFailure,
  loadUserOperationListSuccess,
  saveDeposit,
  saveDepositFailure,
  saveDepositSuccess,
  saveUserAccount,
  saveUserAccountFailure,
  saveUserAccountSuccess,
  saveWithdraw,
  saveWithdrawFailure,
  saveWithdrawSuccess,
} from './account.actions';
import { catchError, map, mergeMap, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UserAccount } from '../../api/model/userAccount';

@Injectable()
export class AccountEffects {
  private _apiService$: ApiService = inject(ApiService);
  private toasterService: ToastrService = inject(ToastrService);

  saveDeposit$ = createEffect(() => {
    return inject(Actions).pipe(
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
    );
  });

  saveWithdraw$ = createEffect(() => {
    return inject(Actions).pipe(
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
    );
  });

  listUserAccount$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadAccountBalanceListAction),
      mergeMap((action) => {
        return this._apiService$.loadAccountBalanceList(action.userId).pipe(
          map((data) => {
            return loadAccountBalanceListSuccess({ accountBalanceList: data });
          }),
          catchError((error: any) => {
            return [loadAccountBalanceListFailure({ error })];
          }),
        );
      }),
    );
  });

  loadUserOperation$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadUserOperationListAction),
      mergeMap((action) => {
        return this._apiService$
          .loadUserOperationList(action.accountOperationsRequest)
          .pipe(
            map((data) => {
              return loadUserOperationListSuccess({ userOperationList: data });
            }),
            catchError((error: any) => {
              return [loadUserOperationListFailure({ error })];
            }),
          );
      }),
    );
  });

  saveAccount$ = createEffect(() => {
    return inject(Actions).pipe(
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
    );
  });

  private _getCreateOrUpdateObservable(
    userAccount: UserAccount,
  ): Observable<any> {
    if (userAccount.id !== undefined && userAccount.id !== null) {
      return this._apiService$.updateUserAccount(userAccount.id, userAccount);
    }
    return this._apiService$.createUserAccount(userAccount);
  }
}
