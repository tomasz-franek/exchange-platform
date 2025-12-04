import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {mergeMap, pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {inject} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {UserAccount} from '../api/model/userAccount';
import {UserData} from '../api/model/userData';
import {AccountOperation} from '../api/model/accountOperation';
import {AccountAmountResponse} from '../api/model/accountAmountResponse';
import {UserBankAccount} from '../api/model/userBankAccount';
import {ApiService} from '../../services/api.service';
import {UserAccountRequest} from '../api/model/userAccountRequest';
import {LoadUserRequest} from '../api/model/loadUserRequest';
import {AccountOperationsRequest} from '../api/model/accountOperationsRequest';
import {AccountAmountRequest} from '../api/model/accountAmountRequest';
import {UserBankAccountRequest} from '../api/model/userBankAccountRequest';
import {UserAccountOperation} from '../api/model/userAccountOperation';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {CorrectionRequest} from '../api/model/correctionRequest';

type AccountState = {
  userAccounts: UserAccount[];
  users: UserData[];
  systemAccounts: UserAccount[];
  accountOperations: AccountOperation[];
  accountAmountResponse: AccountAmountResponse;
  userBankAccounts: UserBankAccount[];
  isLoading: boolean;
}
export const initialAccountState: AccountState = {
  userAccounts: [],
  users: [],
  systemAccounts: [],
  accountOperations: [],
  accountAmountResponse: {} as AccountAmountResponse,
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
    loadAccounts: rxMethod<UserAccountRequest>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((userAccountRequest) => {
          return apiService.loadAccounts(userAccountRequest).pipe(
            tapResponse({
              next: (userAccounts) => patchState(store, {userAccounts}),
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                });
                patchState(store, {userAccounts: []})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadUserList: rxMethod<LoadUserRequest>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((loadUserRequest) => {
          return apiService.loadUserList(loadUserRequest).pipe(
            tapResponse({
              next: (users) => patchState(store, {users}),
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                });
                patchState(store, {users: []})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadAccountOperationList: rxMethod<AccountOperationsRequest>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((loadAccountOperationsRequest) => {
          return apiService.loadAccountOperationList(loadAccountOperationsRequest).pipe(
            tapResponse({
              next: (accountOperations) => patchState(store, {accountOperations}),
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                });
                patchState(store, {accountOperations: []})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadOperationPdfDocument: rxMethod<AccountOperationsRequest>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((loadAccountOperationsRequest) => {
          return apiService.loadOperationPdfDocument(loadAccountOperationsRequest).pipe(
            tapResponse({
              next: (data) => {
                const file = new Blob([data], {type: 'application/pdf'});
                const fileURL = URL.createObjectURL(file);
                window.open(fileURL);
              },
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                });
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadSystemAccountList: rxMethod<string>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        mergeMap((accountType) => {
          if (accountType == 'system') {
            return apiService.loadSystemAccountList().pipe(
              tapResponse({
                next: (systemAccounts) => patchState(store, {systemAccounts}),
                error: (errorResponse: HttpErrorResponse) => {
                  messageService.add({
                    severity: 'error',
                    detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                  });
                  patchState(store, {systemAccounts: []})
                },
                finalize: () => patchState(store, {isLoading: false}),
              })
            );
          } else {
            return apiService.loadExchangeAccountList().pipe(
              tapResponse({
                next: (systemAccounts) => patchState(store, {systemAccounts}),
                error: (errorResponse: HttpErrorResponse) => {
                  messageService.add({
                    severity: 'error',
                    detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                  });
                  patchState(store, {systemAccounts: []})
                },
                finalize: () => patchState(store, {isLoading: false}),
              })
            );
          }
        }),
      )
    ),
    loadAccountAmount: rxMethod<AccountAmountRequest>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((request) => {
          return apiService.loadAccountAmount(request).pipe(
            tapResponse({
              next: (accountAmountResponse) => patchState(store, {accountAmountResponse}),
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                });
                patchState(store, {accountAmountResponse: {}})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadBankAccountList: rxMethod<UserBankAccountRequest>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((userBankAccountRequest) => {
          return apiService.loadBankAccountList(userBankAccountRequest).pipe(
            tapResponse({
              next: (userBankAccounts) => patchState(store, {userBankAccounts}),
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                });
                patchState(store, {userBankAccounts: []})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    validateBankAccount: rxMethod<UserBankAccount>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((userBankAccount) => {
          return apiService.validateBankAccount(userBankAccount).pipe(
            tapResponse({
              next: (_) => {
                messageService.add({
                  severity: 'success',
                  detail: translateService.instant('MESSAGES.VALIDATED'),
                });
              },
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.SEND') + errorResponse.message,
                });
                patchState(store, {userBankAccounts: []})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    saveAccountDeposit: rxMethod<UserAccountOperation>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((depositRequest) => {
          return apiService.saveAccountDeposit(depositRequest).pipe(
            tapResponse({
              next: (_) => {
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
                patchState(store, {userBankAccounts: []})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    saveWithdrawRequest: rxMethod<UserAccountOperation>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((withdrawRequest) => {
          return apiService.saveWithdrawRequest(withdrawRequest).pipe(
            tapResponse({
              next: (_) => {
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
                patchState(store, {userBankAccounts: []})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    saveCorrectionRequest: rxMethod<CorrectionRequest>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap((correctionRequest) => {
          return apiService.saveCorrectionRequest(correctionRequest).pipe(
            tapResponse({
              next: (_) => {
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
                patchState(store, {userBankAccounts: []})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    clearBankAccounts: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {userBankAccounts: []})),
      )
    ),
  }))
);
