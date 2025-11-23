import {inject, Injectable} from '@angular/core';
import {ApiService} from '../../../services/api/api.service';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {
  loadAccountBalanceListAction,
  loadAccountBalanceListFailure,
  loadAccountBalanceListSuccess,
  loadBankAccountListAction,
  loadBankAccountListFailure,
  loadBankAccountListSuccess,
  loadUserOperationListAction,
  loadUserOperationListFailure,
  loadUserOperationListSuccess,
  saveUserAccount,
  saveUserAccountFailure,
  saveUserAccountSuccess,
  saveUserBankAccountAction,
  saveUserBankAccountFailure,
  saveUserBankAccountSuccess,
  saveWithdrawAction,
  saveWithdrawFailure,
  saveWithdrawSuccess
} from './account.actions';
import {catchError, map, mergeMap, Observable} from 'rxjs';
import {UserAccount} from '../../api/model/userAccount';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class AccountEffects {
  saveAccount$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(saveUserAccount),
      mergeMap((action) => {
        return this._getCreateOrUpdateUserAccountObservable(
          action.userAccount
        ).pipe(
          map((data) => {
            return saveUserAccountSuccess({userAccount: data});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [saveUserAccountFailure({errorResponse})];
          })
        );
      })
    );
  });
  private _apiService$: ApiService = inject(ApiService);
  listUserAccount$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadAccountBalanceListAction),
      mergeMap(() => {
        return this._apiService$.loadAccountBalanceList().pipe(
          map((data) => {
            return loadAccountBalanceListSuccess({accountBalanceList: data});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadAccountBalanceListFailure({errorResponse})];
          })
        );
      })
    );
  });
  loadUserBankAccountList$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadBankAccountListAction),
      mergeMap((action) => {
        return this._apiService$
        .loadBankAccountList(action.currency)
        .pipe(
          map((userBankAccounts) => {
            return loadBankAccountListSuccess({
              userBankAccounts
            });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadBankAccountListFailure({errorResponse})];
          })
        );
      })
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
            return loadUserOperationListSuccess({userOperationList: data});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadUserOperationListFailure({errorResponse})];
          })
        );
      })
    );
  });
  saveWithdraw$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(saveWithdrawAction),
      mergeMap((action) => {
        return this._apiService$
        .saveWithdrawRequest(action.withdrawRequest)
        .pipe(
          map(() => {
            return saveWithdrawSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [saveWithdrawFailure({errorResponse})];
          })
        );
      })
    );
  });
  saveUserBankAccount$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(saveUserBankAccountAction),
      mergeMap((action) => {
        return this._apiService$
        .saveBankAccount(action.userBankAccount)
        .pipe(
          map((userBankAccount) => {
            return saveUserBankAccountSuccess({userBankAccount});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [saveUserBankAccountFailure({errorResponse})];
          })
        );
      })
    );
  });

  private _getCreateOrUpdateUserAccountObservable(
    userAccount: UserAccount
  ): Observable<any> {
    if (userAccount.id !== undefined && userAccount.id !== null) {
      return this._apiService$.updateUserAccount(userAccount);
    }
    return this._apiService$.createUserAccount(userAccount);
  }

}
