import {inject, Injectable} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {catchError, map, mergeMap, Observable} from 'rxjs';
import {
  loadSystemMessageListAction,
  loadSystemMessageListFailure,
  loadSystemMessageListSuccess,
  saveSystemMessageAction,
  saveSystemMessageFailure,
  saveSystemMessageSuccess,
} from './message.actions';
import {SystemMessage} from '../../api/model/systemMessage';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class MessageEffects {

  saveSystemMessage$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(saveSystemMessageAction),
      mergeMap((action) => {
        return this._getCreateOrUpdateObservable(action.systemMessage).pipe(
          map((systemMessage) => {
            return saveSystemMessageSuccess({systemMessage});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [saveSystemMessageFailure({errorResponse})];
          }),
        );
      }),
    );
  });
  private readonly _apiService$: ApiService = inject(ApiService);
  loadSystemMessages$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadSystemMessageListAction),
      mergeMap(() => {
        return this._apiService$.loadSystemMessageList().pipe(
          map((systemMessages) => {
            return loadSystemMessageListSuccess({systemMessages});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadSystemMessageListFailure({errorResponse})];
          }),
        );
      }),
    );
  });

  private _getCreateOrUpdateObservable(
    systemMessage: SystemMessage,
  ): Observable<any> {
    if (systemMessage.id !== undefined) {
      return this._apiService$.updateSystemMessage(systemMessage);
    }
    return this._apiService$.saveSystemMessage(systemMessage);
  }
}
