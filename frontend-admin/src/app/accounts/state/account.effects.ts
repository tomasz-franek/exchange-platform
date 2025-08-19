import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs';
import {
  loadAccountListAction,
  loadAccountListFailure,
  loadAccountListSuccess,
  loadSystemAccountListAction,
  loadSystemAccountListFailure,
  loadSystemAccountListSuccess,
  loadSystemAccountOperationListAction,
  loadSystemAccountOperationListFailure,
  loadSystemAccountOperationListSuccess,
  loadSystemOperationPdfDocumentAction,
  loadSystemOperationPdfDocumentFailure,
  loadSystemOperationPdfDocumentSuccess,
  loadUserListAction,
  loadUserListActionFailure,
  loadUserListActionSuccess,
  saveDeposit,
  saveDepositFailure,
  saveDepositSuccess,
  saveWithdraw,
  saveWithdrawFailure,
  saveWithdrawSuccess,
} from './account.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AccountEffects {
  private readonly _apiService$: ApiService = inject(ApiService);
  loadUserAccount$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadAccountListAction),
      mergeMap((action) => {
        return this._apiService$.loadAccounts(action.userAccountRequest).pipe(
          map((userAccounts) => {
            return loadAccountListSuccess({ userAccounts });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadAccountListFailure({ errorResponse })];
          }),
        );
      }),
    );
  });
  loadUsers$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadUserListAction),
      mergeMap((action) => {
        return this._apiService$.loadUserList(action.loadUserRequest).pipe(
          map((users) => {
            return loadUserListActionSuccess({ users });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadUserListActionFailure({ errorResponse })];
          }),
        );
      }),
    );
  });

  loadSystemAccount$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadSystemAccountListAction),
      mergeMap(() => {
        return this._apiService$.loadSystemAccountList().pipe(
          map((systemAccounts) => {
            return loadSystemAccountListSuccess({ systemAccounts });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadSystemAccountListFailure({ errorResponse })];
          }),
        );
      }),
    );
  });

  loadSystemAccountOperations$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadSystemAccountOperationListAction),
      mergeMap((action) => {
        return this._apiService$
          .loadSystemAccountOperationList(action.loadAccountOperationsRequest)
          .pipe(
            map((systemAccountOperations) => {
              return loadSystemAccountOperationListSuccess({
                systemAccountOperations,
              });
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return [loadSystemAccountOperationListFailure({ errorResponse })];
            }),
          );
      }),
    );
  });

  loadSystemOperationPdfDocument$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadSystemOperationPdfDocumentAction),
      mergeMap((action) => {
        return this._apiService$
          .loadSystemOperationPdfDocument(action.loadAccountOperationsRequest)
          .pipe(
            map((data) => {
              const file = new Blob([data], { type: 'application/pdf' });
              const fileURL = URL.createObjectURL(file);
              window.open(fileURL);
              return loadSystemOperationPdfDocumentSuccess();
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return [loadSystemOperationPdfDocumentFailure({ errorResponse })];
            }),
          );
      }),
    );
  });

  private readonly toasterService: ToastrService = inject(ToastrService);
  saveDeposit$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(saveDeposit),
      mergeMap((action) => {
        return this._apiService$.saveAccountDeposit(action.depositRequest).pipe(
          map(() => {
            this.toasterService.info('Deposit successfully sent');
            return saveDepositSuccess();
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            this.toasterService.error(
              'Error occurred while saving account-deposit request',
            );
            return [saveDepositFailure({ errorResponse })];
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
            catchError((errorResponse: HttpErrorResponse) => {
              this.toasterService.error(
                'Error occurred while sending withdraw request',
              );
              return [saveWithdrawFailure({ errorResponse })];
            }),
          );
      }),
    );
  });
}
