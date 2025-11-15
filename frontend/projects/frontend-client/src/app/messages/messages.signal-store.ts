import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';

import {debounceTime, distinctUntilChanged, pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {inject} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {SystemMessage} from '../api/model/systemMessage';
import {ApiService} from '../../services/api/api.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';

type MessageState = {
  systemMessages: SystemMessage[];
  isLoading: boolean;
}
export const initialMessageState: MessageState = {
  systemMessages: [],
  isLoading: false
};

export const messageStore = signalStore(
  {providedIn: 'root'},
  withState(initialMessageState),
  withMethods((store, apiService = inject(ApiService)
    ) => ({
      loadSystemMessageList: rxMethod<void>(
        pipe(
          debounceTime(300),
          distinctUntilChanged(),
          tap(() => patchState(store, {isLoading: true})),
          switchMap(() => {
            return apiService.loadSystemMessageList().pipe(
              tapResponse({
                next: (systemMessages) => patchState(store, {systemMessages}),
                error: (error: HttpErrorResponse) => {
                  console.log(error.message);
                  patchState(store, {systemMessages: []})
                },
                finalize: () => patchState(store, {isLoading: false}),
              })
            )
          })
        )
      ),
    })
  )
);

