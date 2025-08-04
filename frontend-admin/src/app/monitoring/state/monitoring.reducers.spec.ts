import {initialMonitoringState, monitoringReducers} from "./monitoring.reducers";
import {
  loadActuatorAdminHealthCheckSuccess,
  loadActuatorExternalHealthCheckSuccess,
  loadActuatorInternalHealthCheckSuccess
} from "./monitoring.actions";

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
});
