import {createAction, props} from "@ngrx/store";
import {HttpErrorResponse} from "@angular/common/http";

export const loadActuatorAdminHealthCheckAction = createAction(
  '[Monitoring] Load Actuator Admin Health Check Action',
);
export const loadActuatorAdminHealthCheckSuccess = createAction(
  '[Monitoring] Load Actuator Admin Health Check Success',
  props<{ adminHealthCheck: object }>(),
);

export const loadActuatorAdminHealthCheckFailure = createAction(
  '[Monitoring] Load Actuator Admin Health Check Failure',
  props<{
    errorResponse: HttpErrorResponse,
    status: object;
  }>(),
)

export const loadActuatorInternalHealthCheckAction = createAction(
  '[Monitoring] Load Actuator Internal Health Check Action',
);
export const loadActuatorInternalHealthCheckSuccess = createAction(
  '[Monitoring] Load Actuator Internal Health Check Success',
  props<{ internalHealthCheck: object }>(),
);

export const loadActuatorInternalHealthCheckFailure = createAction(
  '[Monitoring] Load Actuator Internal Health Check Failure',
  props<{
    errorResponse: HttpErrorResponse,
    status: object
  }>(),
)

export const loadActuatorExternalHealthCheckAction = createAction(
  '[Monitoring] Load Actuator External Health Check Action',
);
export const loadActuatorExternalHealthCheckSuccess = createAction(
  '[Monitoring] Load Actuator External Health Check Success',
  props<{ externalHealthCheck: object }>(),
);

export const loadActuatorExternalHealthCheckFailure = createAction(
  '[Monitoring] Load Actuator External Health Check Failure',
  props<{
    errorResponse: HttpErrorResponse,
    status: object
  }>(),
)
