import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {catchError, map, mergeMap} from "rxjs";
import {MonitoringService} from '../services/monitoring.service';
import {HttpErrorResponse} from '@angular/common/http';
import {
  loadActuatorAdminHealthCheckAction,
  loadActuatorAdminHealthCheckFailure,
  loadActuatorAdminHealthCheckSuccess,
  loadActuatorExternalHealthCheckAction,
  loadActuatorExternalHealthCheckFailure,
  loadActuatorExternalHealthCheckSuccess,
  loadActuatorInternalHealthCheckAction,
  loadActuatorInternalHealthCheckFailure,
  loadActuatorInternalHealthCheckSuccess
} from './monitoring.actions';

@Injectable()
export class MonitoringEffects {
  private readonly _apiService$: MonitoringService = inject(MonitoringService);

  loadAdminHealthCheck$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadActuatorAdminHealthCheckAction),
      mergeMap(() => {
        return this._apiService$.loadActuatorAdminHealthCheck().pipe(
          map((adminHealthCheck) => {
            return loadActuatorAdminHealthCheckSuccess({adminHealthCheck});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadActuatorAdminHealthCheckFailure({errorResponse})];
          }),
        );
      }),
    );
  });

  loadInternalHealthCheck$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadActuatorInternalHealthCheckAction),
      mergeMap(() => {
        return this._apiService$.loadActuatorInternalHealthCheck().pipe(
          map((internalHealthCheck) => {
            return loadActuatorInternalHealthCheckSuccess({internalHealthCheck});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadActuatorInternalHealthCheckFailure({errorResponse})];
          }),
        );
      }),
    );
  });

  loadExternalHealthCheck$ = createEffect(() => {
    return inject(Actions).pipe(
      ofType(loadActuatorExternalHealthCheckAction),
      mergeMap(() => {
        return this._apiService$.loadActuatorExternalHealthCheck().pipe(
          map((externalHealthCheck) => {
            return loadActuatorExternalHealthCheckSuccess({externalHealthCheck});
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return [loadActuatorExternalHealthCheckFailure({errorResponse})];
          }),
        );
      }),
    );
  });

}
