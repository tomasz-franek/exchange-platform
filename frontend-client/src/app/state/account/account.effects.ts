import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  getUserPropertyAction,
  getUserPropertyFailure,
  getUserPropertySuccess,
  loadAccountBalanceListAction,
  loadAccountBalanceListFailure,
  loadAccountBalanceListSuccess,
  loadUserOperationListAction,
  loadUserOperationListFailure,
  loadUserOperationListSuccess,
  saveUserAccount,
  saveUserAccountFailure,
  saveUserAccountSuccess,
  saveUserPropertyAction,
  saveUserPropertyFailure,
  saveUserPropertySuccess,
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
              this.toasterService.error(
                'Error occurred while loading user operation',
              );
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
        return this._getCreateOrUpdateUserAccountObservable(
          action.userAccount,
        ).pipe(
          map((data) => {
            this.toasterService.info('Account saved');
            return saveUserAccountSuccess({ userAccount: data });
          }),
          catchError((error: HttpErrorResponse) => {
            if (error.status === 302) {
              this.toasterService.error('Account already exists');
            } else {
              this.toasterService.error('Error occurred while saving account');
            }
            return [saveUserAccountFailure({ error })];
          }),
        );
      }),
    );
  });

  private _getCreateOrUpdateUserAccountObservable(
    userAccount: UserAccount,
  ): Observable<any> {
    if (userAccount.id !== undefined && userAccount.id !== null) {
      return this._apiService$.updateUserAccount(userAccount);
    }
    return this._apiService$.createUserAccount(userAccount);
  }

  saveUserProperty$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(saveUserPropertyAction),
      mergeMap((action) => {
        return this._apiService$.saveUserProperty(action.userProperty).pipe(
          map(() => {
            this.toasterService.info('Property saved');
            return saveUserPropertySuccess();
          }),
          catchError((error: any) => {
            this.toasterService.error(
              'Error occurred while saving user property',
            );
            return [saveUserPropertyFailure({ error })];
          }),
        );
      }),
    );
  });

  getUserProperty$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(getUserPropertyAction),
      mergeMap(() => {
        return this._apiService$.getUserProperty().pipe(
          map((data) => {
            return getUserPropertySuccess({ userProperty: data });
          }),
          catchError((error: any) => {
            return [getUserPropertyFailure({ error })];
          }),
        );
      }),
    );
  });
}
