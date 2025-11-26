import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {inject} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {UserAccount} from '../api/model/userAccount';
import {UserBankAccount} from '../api/model/userBankAccount';
import {UserAccountOperation} from '../api/model/userAccountOperation';
import {AccountBalance} from '../api/model/accountBalance';
import {UserOperation} from '../api/model/userOperation';
import {ApiService} from '../../services/api/api.service';
import {AccountOperationsRequest} from '../api/model/accountOperationsRequest';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';

type AccountState = {
  accountBalanceList: AccountBalance[];
  userAccount: UserAccount | null;
  userOperationList: UserOperation[] | [];
  userBankAccount: UserBankAccount | null;
  userId: string;
  userBankAccounts: UserBankAccount[];
  isLoading: boolean;
}
export const initialAccountState: AccountState = {
  userId: '',
  accountBalanceList: [],
  userOperationList: [],
  userAccount: null,
  userBankAccount: null,
  userBankAccounts: [],
  isLoading: false
};

export const AccountsStore = signalStore(
  {providedIn: 'root'},
  withState(initialAccountState),
  withMethods((store,
               apiService = inject(ApiService),
               translateService = inject(TranslateService),
               messageService = inject(MessageService)
  ) => ({
    loadAccountBalanceList: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return apiService.loadAccountBalanceList().pipe(
            tapResponse({
              next: (accountBalanceList) => patchState(store, {accountBalanceList}),
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                });
                patchState(store, {accountBalanceList: []})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadUserOperationList: rxMethod<AccountOperationsRequest>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((accountOperationsRequest) => {
          return apiService.loadUserOperationList(accountOperationsRequest).pipe(
            tapResponse({
              next: (userOperationList) => patchState(store, {userOperationList}),
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                });
                patchState(store, {userOperationList: []})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    saveAccount: rxMethod<UserAccount>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((userAccount) => {
          if (userAccount.id !== undefined && userAccount.id !== null) {
            return apiService.updateUserAccount(userAccount).pipe(
              tapResponse({
                next: (userAccount) => patchState(store, {userAccount}),
                error: (errorResponse: HttpErrorResponse) => {
                  messageService.add({
                    severity: 'error',
                    detail: translateService.instant('ERRORS.SEND') + errorResponse.message,
                  });
                  patchState(store, {userAccount: {} as UserAccount})
                },
                finalize: () => patchState(store, {isLoading: false}),
              })
            )
          } else {
            return apiService.createUserAccount(userAccount).pipe(
              tapResponse({
                next: (userAccount) => patchState(store, {userAccount}),
                error: (errorResponse: HttpErrorResponse) => {
                  messageService.add({
                    severity: 'error',
                    detail: translateService.instant('ERRORS.SEND') + errorResponse.message,
                  });
                  patchState(store, {userAccount: {} as UserAccount})
                },
                finalize: () => patchState(store, {isLoading: false}),
              })
            )
          }
        })
      )
    ),
    saveWithdrawRequest: rxMethod<UserAccountOperation>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((accountOperationsRequest) => {
          return apiService.saveWithdrawRequest(accountOperationsRequest).pipe(
            tapResponse({
              next: (data) => {
                messageService.add({
                  severity: 'success',
                  detail: translateService.instant('MESSAGES.SAVED'),
                });
              },
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.SEND') + errorResponse.message,
                });

                patchState(store, {userOperationList: []})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    saveBankAccount: rxMethod<UserBankAccount>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((userBankAccount) => {
          return apiService.saveBankAccount(userBankAccount).pipe(
            tapResponse({
              next: (userBankAccount) => {
                patchState(store, {userBankAccount})
                messageService.add({
                  severity: 'success',
                  detail: translateService.instant('MESSAGES.SAVED'),
                });
              },
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.SEND') + errorResponse.message,
                });

                patchState(store, {userOperationList: []})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadBankAccountList: rxMethod<string>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((currency) => {
          return apiService.loadBankAccountList(currency).pipe(
            tapResponse({
              next: (userBankAccounts) => {
                patchState(store, {userBankAccounts})
                messageService.add({
                  severity: 'success',
                  detail: translateService.instant('MESSAGES.SAVED'),
                });
              },
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                });
                patchState(store, {userOperationList: []})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
  }))
);
