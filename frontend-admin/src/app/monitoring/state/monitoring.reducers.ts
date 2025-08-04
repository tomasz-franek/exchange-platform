import {MonitoringState} from "./monitoring.selectors";
import {createReducer, on} from "@ngrx/store";
import {
  loadActuatorAdminHealthCheckSuccess,
  loadActuatorExternalHealthCheckSuccess,
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
  })
);
