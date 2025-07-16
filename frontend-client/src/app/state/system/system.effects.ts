import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs';
import {
  loadBuildInfoAction,
  loadBuildInfoActionError,
  loadBuildInfoActionSuccess,
  loadSystemMessageListAction,
  loadSystemMessageListActionError,
  loadSystemMessageListActionSuccess,
} from './system.actions';

@Injectable()
export class SystemEffects {
  private _apiService$: ApiService = inject(ApiService);

  loadBuildInfo$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadBuildInfoAction),
      mergeMap(() => {
        return this._apiService$.loadBuildInfo().pipe(
          map((data) => {
            return loadBuildInfoActionSuccess({ buildInfo: data });
          }),
          catchError((error: any) => {
            return [loadBuildInfoActionError({ error })];
          }),
        );
      }),
    );
  });

  loadSystemMessageList$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadSystemMessageListAction),
      mergeMap(() => {
        return this._apiService$.loadSystemMessageList().pipe(
          map((data) => {
            return loadSystemMessageListActionSuccess({
              systemMessageList: data,
            });
          }),
          catchError((error: any) => {
            return [loadSystemMessageListActionError({ error })];
          }),
        );
      }),
    );
  });
}
