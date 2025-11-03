import {inject, Injectable} from '@angular/core';
import {ApiService} from '../services/api.service';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap} from 'rxjs';
import {loadBuildInfoAction, loadBuildInfoFailure, loadBuildInfoSuccess} from "./util.actions";
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class UtilEffects {
  private readonly _apiService$: ApiService = inject(ApiService);

  loadBuildInfo$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadBuildInfoAction),
      mergeMap(() => {
        return this._apiService$.loadBuildInfo().pipe(
          map((buildInfo) => {
            return loadBuildInfoSuccess({buildInfo});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadBuildInfoFailure({errorResponse})];
          }),
        );
      }),
    );
  });
}
