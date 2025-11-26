import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {inject} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiService} from '../../services/api/api.service';
import {BuildInfo} from '../api/model/buildInfo';
import {TranslateService} from '@ngx-translate/core';
import {MessageService} from 'primeng/api';

type UtilState = {
  buildInfo: BuildInfo | undefined;
  isLoading: boolean;
}
export const initialUtilState: UtilState = {
  buildInfo: {},
  isLoading: false
};

export const UtilStore = signalStore(
  {providedIn: 'root'},
  withState(initialUtilState),
  withMethods((store,
               apiService = inject(ApiService),
               translateService = inject(TranslateService),
               messageService = inject(MessageService)
  ) => ({
    loadBuildInfo: rxMethod<void>(
      pipe(
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return apiService.loadBuildInfo().pipe(
            tapResponse({
              next: (buildInfo) => {
                patchState(store, {buildInfo})
              },
              error: (errorResponse: HttpErrorResponse) => {
                messageService.add({
                  severity: 'error',
                  detail: translateService.instant('ERRORS.LOAD') + errorResponse.message,
                });
                patchState(store, {buildInfo: {} as BuildInfo})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
  }))
);
