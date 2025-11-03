import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs';
import {
  loadAccountAmountAction,
  loadAccountAmountFailure,
  loadAccountAmountSuccess,
  loadAccountListAction,
  loadAccountListFailure,
  loadAccountListSuccess,
  loadAccountOperationListAction,
  loadAccountOperationListFailure,
  loadAccountOperationListSuccess,
  loadBankAccountListAction,
  loadBankAccountListFailure,
  loadBankAccountListSuccess,
  loadOperationPdfDocumentAction,
  loadOperationPdfDocumentFailure,
  loadOperationPdfDocumentSuccess,
  loadSystemAccountListAction,
  loadSystemAccountListFailure,
  loadSystemAccountListSuccess,
  loadUserListAction,
  loadUserListActionFailure,
  loadUserListActionSuccess,
  saveDeposit,
  saveDepositFailure,
  saveDepositSuccess,
  saveWithdraw,
  saveWithdrawFailure,
  saveWithdrawSuccess,
  validateUserBankAccountAction,
  validateUserBankAccountFailure,
  validateUserBankAccountSuccess,
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
      mergeMap((action) => {
        if (action.accountType == 'system') {
          return this._apiService$.loadSystemAccountList().pipe(
            map((systemAccounts) => {
              return loadSystemAccountListSuccess({ systemAccounts });
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return [loadSystemAccountListFailure({ errorResponse })];
            }),
          );
        } else {
          return this._apiService$.loadExchangeAccountList().pipe(
            map((systemAccounts) => {
              return loadSystemAccountListSuccess({ systemAccounts });
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return [loadSystemAccountListFailure({ errorResponse })];
            }),
          );
        }
      }),
    );
  });

  loadAccountOperations$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadAccountOperationListAction),
      mergeMap((action) => {
        return this._apiService$
          .loadAccountOperationList(action.loadAccountOperationsRequest)
          .pipe(
            map((accountOperations) => {
              return loadAccountOperationListSuccess({
                accountOperations,
              });
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return [loadAccountOperationListFailure({ errorResponse })];
            }),
          );
      }),
    );
  });

  loadOperationPdfDocument$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadOperationPdfDocumentAction),
      mergeMap((action) => {
        return this._apiService$
          .loadOperationPdfDocument(action.loadAccountOperationsRequest)
          .pipe(
            map((data) => {
              const file = new Blob([data], { type: 'application/pdf' });
              const fileURL = URL.createObjectURL(file);
              window.open(fileURL);
              return loadOperationPdfDocumentSuccess();
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return [loadOperationPdfDocumentFailure({ errorResponse })];
            }),
          );
      }),
    );
  });
  loadAccountAmount$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadAccountAmountAction),
      mergeMap((action) => {
        return this._apiService$.loadAccountAmount(action.request).pipe(
          map((accountAmountResponse) => {
            return loadAccountAmountSuccess({ accountAmountResponse });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadAccountAmountFailure({ errorResponse })];
          }),
        );
      }),
    );
  });

  loadUserBankAccountList$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadBankAccountListAction),
      mergeMap((action) => {
        return this._apiService$
          .loadBankAccountList(action.userBankAccountRequest)
          .pipe(
            map((userBankAccounts) => {
              return loadBankAccountListSuccess({
                userBankAccounts,
              });
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return [loadBankAccountListFailure({ errorResponse })];
            }),
          );
      }),
    );
  });

  validateUserBankAccount$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(validateUserBankAccountAction),
      mergeMap((action) => {
        return this._apiService$
          .validateBankAccount(action.userBankAccount)
          .pipe(
            map((bankAccounts) => {
              return validateUserBankAccountSuccess();
            }),
            catchError((errorResponse: HttpErrorResponse) => {
              return [validateUserBankAccountFailure({ errorResponse })];
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
