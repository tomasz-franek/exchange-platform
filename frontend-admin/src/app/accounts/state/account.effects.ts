import {inject, Injectable} from '@angular/core';
import {ApiService} from '../../services/api.service';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap} from 'rxjs';
import {
  loadAccountListAction,
  loadAccountListFailure,
  loadAccountListSuccess
} from './account.actions';

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
          catchError((error: any) => {
            return [loadAccountListFailure({error})];
          }),
        );
      }),
    );
  });
}
