import {initialMonitoringState, monitoringReducers} from "./monitoring.reducers";
import {
  loadActuatorAdminHealthCheckFailure,
  loadActuatorAdminHealthCheckSuccess,
  loadActuatorExternalHealthCheckFailure,
  loadActuatorExternalHealthCheckSuccess,
  loadActuatorInternalHealthCheckFailure,
  loadActuatorInternalHealthCheckSuccess
} from "./monitoring.actions";
import {HttpErrorResponse} from '@angular/common/http';

describe('monitoringReducers', () => {
  it('should return the initial state', () => {
    const action = {type: 'UNKNOWN_ACTION'};
    const state = monitoringReducers(undefined, action);
    expect(state).toBe(initialMonitoringState);
  });

  it('should handle loadActuatorAdminHealthCheckSuccess', () => {
    const adminHealthCheck: object = {
      status: 'success',
    };
    const action = loadActuatorAdminHealthCheckSuccess({adminHealthCheck});
    const state = monitoringReducers(initialMonitoringState, action);

    expect(state).toEqual({
      ...initialMonitoringState, adminHealthCheck: adminHealthCheck,
    });
  });

  it('should handle loadActuatorExternalHealthCheckAction', () => {
    const externalHealthCheck: object = {
      status: 'success',
    };
    const action = loadActuatorExternalHealthCheckSuccess({externalHealthCheck});
    const state = monitoringReducers(initialMonitoringState, action);

    expect(state).toEqual({
      ...initialMonitoringState, externalHealthCheck: externalHealthCheck,
    });
  });

  it('should handle loadActuatorInternalHealthCheckSuccess', () => {
    const internalHealthCheck: object = {
      status: 'success',
    };
    const action = loadActuatorInternalHealthCheckSuccess({internalHealthCheck});
    const state = monitoringReducers(initialMonitoringState, action);

    expect(state).toEqual({
      ...initialMonitoringState, internalHealthCheck: internalHealthCheck,
    });
  });

  it('should handle loadActuatorInternalHealthCheckFailure', () => {
    const internalHealthCheck: object = {
      status: 'unknown',
    };
    const action = loadActuatorInternalHealthCheckFailure({
      errorResponse: {} as HttpErrorResponse,
      status: internalHealthCheck
    });
    const state = monitoringReducers(initialMonitoringState, action);

    expect(state).toEqual({
      ...initialMonitoringState, internalHealthCheck: internalHealthCheck,
    });
  });

  it('should handle loadActuatorExternalHealthCheckFailure', () => {
    const externalHealthCheck: object = {
      status: 'unknown',
    };
    const action = loadActuatorExternalHealthCheckFailure({
      errorResponse: {} as HttpErrorResponse,
      status: externalHealthCheck
    });
    const state = monitoringReducers(initialMonitoringState, action);

    expect(state).toEqual({
      ...initialMonitoringState, externalHealthCheck: externalHealthCheck,
    });
  });

  it('should handle loadActuatorAdminHealthCheckFailure', () => {
    const adminHealthCheck: object = {
      status: 'unknown',
    };
    const action = loadActuatorAdminHealthCheckFailure({
      errorResponse: {} as HttpErrorResponse,
      status: adminHealthCheck
    });
    const state = monitoringReducers(initialMonitoringState, action);

    expect(state).toEqual({
      ...initialMonitoringState, adminHealthCheck: adminHealthCheck,
    });
  });
});
