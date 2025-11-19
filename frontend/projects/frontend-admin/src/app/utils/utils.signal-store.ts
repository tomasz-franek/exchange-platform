import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {ApiService} from '../../services/api.service';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {BuildInfo} from '../api/model/buildInfo';
import {debounceTime, distinctUntilChanged, pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {inject} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';

type UtilState = {
  buildInfo: BuildInfo;
  isLoading: boolean;
}
export const initialUtilState: UtilState = {
  buildInfo: {} as BuildInfo,
  isLoading: false
};

export const buildInfoStore = signalStore(
  {providedIn: 'root'},
  withState(initialUtilState),
  withMethods((store, apiService = inject(ApiService)) => ({
    loadBuildInfo: rxMethod<void>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return apiService.loadBuildInfo().pipe(
            tapResponse({
              next: (buildInfo) => patchState(store, {buildInfo}),
              error: (error: HttpErrorResponse) => console.log(error.message),
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    )
  }))
);
