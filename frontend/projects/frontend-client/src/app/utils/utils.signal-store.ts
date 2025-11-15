import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {debounceTime, distinctUntilChanged, pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {inject} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiService} from '../../services/api/api.service';
import {BuildInfo} from '../api/model/buildInfo';

type UtilState = {
  buildInfo: BuildInfo | undefined;
  isLoading: boolean;
}
export const initialUtilState: UtilState = {
  buildInfo: {},
  isLoading: false
};

export const utilStore = signalStore(
  {providedIn: 'root'},
  withState(initialUtilState),
  withMethods((store,
               apiService = inject(ApiService),
  ) => ({
    loadBuildInfo: rxMethod<void>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return apiService.loadBuildInfo().pipe(
            tapResponse({
              next: (buildInfo) => {
                patchState(store, {buildInfo})
              },
              error: (error: HttpErrorResponse) => console.log(error.message),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
  }))
);
