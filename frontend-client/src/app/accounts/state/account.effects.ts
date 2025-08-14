import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadAccountBalanceListAction,
  loadAccountBalanceListFailure,
  loadAccountBalanceListSuccess,
  loadUserOperationListAction,
  loadUserOperationListFailure,
  loadUserOperationListSuccess,
  saveUserAccount,
  saveUserAccountFailure,
  saveUserAccountSuccess,
  saveWithdrawAction,
  saveWithdrawFailure,
  saveWithdrawSuccess
} from './account.actions';
import { catchError, map, mergeMap, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UserAccount } from '../../api/model/userAccount';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AccountEffects {
  private _apiService$: ApiService = inject(ApiService);
  private toasterService: ToastrService = inject(ToastrService);

  listUserAccount$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadAccountBalanceListAction),
      mergeMap(() => {
        return this._apiService$.loadAccountBalanceList().pipe(
          map((data) => {
            return loadAccountBalanceListSuccess({ accountBalanceList: data });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadAccountBalanceListFailure({ errorResponse })];
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
            return loadUserOperationListSuccess({ userOperationList: data });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toasterService.error(
              'Error occurred while loading user operation'
            );
            return [loadUserOperationListFailure({ errorResponse })];
          })
        );
      })
    );
  });

  saveAccount$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(saveUserAccount),
      mergeMap((action) => {
        return this._getCreateOrUpdateUserAccountObservable(
          action.userAccount
        ).pipe(
          map((data) => {
            this.toasterService.info('Account saved');
            return saveUserAccountSuccess({ userAccount: data });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            if (errorResponse.status === 302) {
              this.toasterService.error('Account already exists');
            } else {
              this.toasterService.error('Error occurred while saving account');
            }
            return [saveUserAccountFailure({ errorResponse })];
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
            this.toasterService.info('Withdraw request successfully sent');
            return saveWithdrawSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toasterService.error(
              'Error occurred while sending withdraw request'
            );
            return [saveWithdrawFailure({ errorResponse })];
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
