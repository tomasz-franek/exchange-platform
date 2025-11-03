import {MonitoringState} from "./monitoring.selectors";
import {createReducer, on} from "@ngrx/store";
import {
  loadActuatorAdminHealthCheckFailure,
  loadActuatorAdminHealthCheckSuccess,
  loadActuatorExternalHealthCheckFailure,
  loadActuatorExternalHealthCheckSuccess,
  loadActuatorInternalHealthCheckFailure,
  loadActuatorInternalHealthCheckSuccess
} from './monitoring.actions';

export const initialMonitoringState: MonitoringState = {
  adminHealthCheck: {},
  internalHealthCheck: {},
  externalHealthCheck: {},
};

export const monitoringReducers = createReducer(
  initialMonitoringState,
  on(loadActuatorInternalHealthCheckSuccess, (state, action) => {
    return {...state, internalHealthCheck: action.internalHealthCheck};
  }),
  on(loadActuatorExternalHealthCheckSuccess, (state, action) => {
    return {...state, externalHealthCheck: action.externalHealthCheck};
  }),
  on(loadActuatorAdminHealthCheckSuccess, (state, action) => {
    return {...state, adminHealthCheck: action.adminHealthCheck};
  }),
  on(loadActuatorExternalHealthCheckFailure, (state, action) => {
    return {...state, externalHealthCheck: action.status};
  }),
  on(loadActuatorInternalHealthCheckFailure, (state, action) => {
    return {...state, internalHealthCheck: action.status};
  }),
  on(loadActuatorAdminHealthCheckFailure, (state, action) => {
    return {...state, adminHealthCheck: action.status};
  })
);
