import {inject, Injectable} from "@angular/core";
import {ApiService} from "../../services/api.service";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap, Observable} from "rxjs";
import {
  saveSystemMessageAction,
  saveSystemMessageFailure,
  saveSystemMessageSuccess
} from "./message.actions";
import {SystemMessage} from "../../api/model/systemMessage";

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
              catchError((error: any) => {
                return [saveSystemMessageFailure({error})];
              }),
          );
        }),
    );
  });
  private readonly _apiService$: ApiService = inject(ApiService);

  private _getCreateOrUpdateObservable(systemMessage: SystemMessage): Observable<any> {
    if (systemMessage.id !== undefined) {
      return this._apiService$.updateSystemMessage(systemMessage);
    }
    systemMessage.version = systemMessage.version || 0;
    return this._apiService$.saveSystemMessage(systemMessage);
  }
}