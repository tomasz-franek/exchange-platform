import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';
import {rxMethod} from '@ngrx/signals/rxjs-interop';
import {debounceTime, distinctUntilChanged, pipe, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';
import {inject} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {MonitoringService} from './services/monitoring.service';

type MonitoringState = {
  adminHealthCheck: any;
  externalHealthCheck: any;
  internalHealthCheck: any;
  isLoading: boolean;
}
export const initialMonitoringState: MonitoringState = {
  adminHealthCheck: {},
  internalHealthCheck: {},
  externalHealthCheck: {},
  isLoading: false
};

export const monitoringStore = signalStore(
  {providedIn: 'root'},
  withState(initialMonitoringState),
  withMethods((store, monitoringService = inject(MonitoringService)) => ({
    loadActuatorAdminHealthCheck: rxMethod<void>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return monitoringService.loadActuatorAdminHealthCheck().pipe(
            tapResponse({
              next: (adminHealthCheck) => patchState(store, {adminHealthCheck}),
              error: (error: HttpErrorResponse) => {
                console.log(error.message);
                patchState(store, {adminHealthCheck: {status: 'Unknown'}})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadActuatorInternalHealthCheck: rxMethod<void>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return monitoringService.loadActuatorInternalHealthCheck().pipe(
            tapResponse({
              next: (internalHealthCheck) => patchState(store, {internalHealthCheck}),
              error: (error: HttpErrorResponse) => {
                console.log(error.message);
                patchState(store, {internalHealthCheck: {status: 'Unknown'}})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
    loadActuatorExternalHealthCheck: rxMethod<void>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, {isLoading: true})),
        switchMap(() => {
          return monitoringService.loadActuatorExternalHealthCheck().pipe(
            tapResponse({
              next: (externalHealthCheck) => patchState(store, {externalHealthCheck}),
              error: (error: HttpErrorResponse) => {
                console.log(error.message);
                patchState(store, {externalHealthCheck: {status: 'Unknown'}})
              },
              finalize: () => patchState(store, {isLoading: false}),
            })
          )
        })
      )
    ),
  }))
);
