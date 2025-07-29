import {inject, Injectable} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap} from 'rxjs';
import {
  loadAccountListAction,
  loadAccountListFailure,
  loadAccountListSuccess,
  saveDeposit,
  saveDepositFailure,
  saveDepositSuccess,
  saveWithdraw,
  saveWithdrawFailure,
  saveWithdrawSuccess
} from './account.actions';
import {HttpErrorResponse} from "@angular/common/http";
import {ToastrService} from "ngx-toastr";

@Injectable()
export class AccountEffects {
  private readonly _apiService$: ApiService = inject(ApiService);
  loadUserAccount$ = createEffect(() => {
    return inject(Actions).pipe(
        ofType(loadAccountListAction),
        mergeMap((action) => {
          return this._apiService$.loadAccounts(action.userAccountRequest).pipe(
              map((userAccounts) => {
                return loadAccountListSuccess({userAccounts});
              }),
              catchError((error: HttpErrorResponse) => {
                return [loadAccountListFailure({error})];
              }),
          );
        }),
    );
  });
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
              catchError((error: HttpErrorResponse) => {
                this.toasterService.error(
                    'Error occurred while saving account-deposit request',
                );
                return [saveDepositFailure({error})];
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
              catchError((error: HttpErrorResponse) => {
                this.toasterService.error(
                    'Error occurred while sending withdraw request',
                );
                return [saveWithdrawFailure({error})];
              }),
          );
        }),
    );
  });
}
