import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { SystemMessage } from '../api/model/systemMessage';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

type MessageState = {
  editedSystemMessage: SystemMessage | undefined;
  systemMessages: SystemMessage[];
  isLoading: boolean;
};
export const initialMessageState: MessageState = {
  editedSystemMessage: undefined,
  systemMessages: [],
  isLoading: false,
};

export const MessageStore = signalStore(
  { providedIn: 'root' },
  withState(initialMessageState),
  withMethods(
    (
      store,
      apiService = inject(ApiService),
      translateService = inject(TranslateService),
      messageService = inject(MessageService),
    ) => ({
      loadSystemMessageList: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() => {
            return apiService.loadSystemMessageList().pipe(
              tapResponse({
                next: (systemMessages) => patchState(store, { systemMessages }),
                error: (errorResponse: HttpErrorResponse) => {
                  messageService.add({
                    severity: 'error',
                    detail:
                      translateService.instant('ERRORS.LOAD') +
                      errorResponse.message,
                  });
                  patchState(store, { systemMessages: [] });
                },
                finalize: () => patchState(store, { isLoading: false }),
              }),
            );
          }),
        ),
      ),
      saveSystemMessage: rxMethod<SystemMessage>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap((systemMessage) => {
            return _getCreateOrUpdateObservable(systemMessage, apiService).pipe(
              tapResponse({
                next: (editedSystemMessage) =>
                  patchState(store, { editedSystemMessage }),
                error: (errorResponse: HttpErrorResponse) => {
                  messageService.add({
                    severity: 'error',
                    detail:
                      translateService.instant('ERRORS.SEND') +
                      errorResponse.message,
                  });
                  patchState(store, {
                    systemMessages: [],
                    editedSystemMessage: undefined,
                  });
                },
                finalize: () => patchState(store, { isLoading: false }),
              }),
            );
          }),
        ),
      ),
    }),
  ),
);

export function _getCreateOrUpdateObservable(
  systemMessage: SystemMessage,
  apiService: ApiService,
): Observable<SystemMessage> {
  if (systemMessage.id == undefined) {
    return apiService.saveSystemMessage(systemMessage);
  } else {
    return apiService.updateSystemMessage(systemMessage);
  }
}
