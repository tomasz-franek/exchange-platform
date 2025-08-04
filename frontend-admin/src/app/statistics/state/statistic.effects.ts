import {inject, Injectable} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap} from 'rxjs';
import {
  loadUserStatisticAction,
  loadUserStatisticFailure,
  loadUserStatisticSuccess
} from "./statistic.actions";
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class StatisticEffects {
  private readonly _apiService$: ApiService = inject(ApiService);

  loadUserStatistic$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadUserStatisticAction),
      mergeMap((action) => {
        return this._apiService$.loadUsersStatistic(action.usersStatisticRequest).pipe(
          map((usersStatisticResponse) => {
            return loadUserStatisticSuccess({usersStatisticResponse});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadUserStatisticFailure({errorResponse})];
          }),
        );
      }),
    );
  });
}
