import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs';
import {
  loadMessageListAction,
  loadMessageListActionFailure,
  loadMessageListActionSuccess
} from './message.actions';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class MessageEffects {
  private _apiService$: ApiService = inject(ApiService);

  loadSystemMessageList$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadMessageListAction),
      mergeMap(() => {
        return this._apiService$.loadSystemMessageList().pipe(
          map((data) => {
            return loadMessageListActionSuccess({
              systemMessageList: data
            });
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadMessageListActionFailure({ errorResponse })];
          })
        );
      })
    );
  });
}
