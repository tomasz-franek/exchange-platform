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
} from "./monitoring.actions";
import {HttpErrorResponse} from '@angular/common/http';

describe('Monitoring Actions', () => {

  describe('loadActuatorAdminHealthCheckAction', () => {
    it('should create an action to Actuator Admin Health Check', () => {
      const action = loadActuatorAdminHealthCheckAction();
      expect(action.type).toBe('[Monitoring] Load Actuator Admin Health Check Action',);
    });
  });

  describe('loadActuatorAdminHealthCheckSuccess', () => {
    it('should create an action for successful loading of Actuator Admin Health Check', () => {
      const adminHealthCheck: object = {
        status: 'success',
      };
      const action = loadActuatorAdminHealthCheckSuccess({adminHealthCheck});

      expect(action.type).toBe('[Monitoring] Load Actuator Admin Health Check Success');
      expect(action.adminHealthCheck).toEqual(adminHealthCheck);
    });
  });

  describe('loadAccountListFailure', () => {
    it('should create an action for failed loading of Actuator Admin Health Check', () => {
      const errorResponse = new HttpErrorResponse({error: 'Error message', status: 404});
      const action = loadActuatorAdminHealthCheckFailure({errorResponse});

      expect(action.type).toBe('[Monitoring] Load Actuator Admin Health Check Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('loadActuatorExternalHealthCheckAction', () => {
    it('should create an action to Actuator External Health Check', () => {
      const action = loadActuatorExternalHealthCheckAction();
      expect(action.type).toBe('[Monitoring] Load Actuator External Health Check Action',);
    });
  });

  describe('loadActuatorExternalHealthCheckSuccess', () => {
    it('should create an action for successful loading of Actuator External Health Check', () => {
      const externalHealthCheck: object = {
        status: 'success',
      };
      const action = loadActuatorExternalHealthCheckSuccess({externalHealthCheck});

      expect(action.type).toBe('[Monitoring] Load Actuator External Health Check Success');
      expect(action.externalHealthCheck).toEqual(externalHealthCheck);
    });
  });

  describe('loadActuatorExternalHealthCheckFailure', () => {
    it('should create an action for failed loading of Actuator External Health Check', () => {
      const errorResponse = new HttpErrorResponse({error: 'Error message', status: 404});
      const action = loadActuatorExternalHealthCheckFailure({errorResponse});

      expect(action.type).toBe('[Monitoring] Load Actuator External Health Check Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('loadActuatorInternalHealthCheckAction', () => {
    it('should create an action to Actuator External Health Check', () => {
      const action = loadActuatorInternalHealthCheckAction();
      expect(action.type).toBe('[Monitoring] Load Actuator Internal Health Check Action',);
    });
  });

  describe('loadActuatorInternalHealthCheckSuccess', () => {
    it('should create an action for successful loading of Actuator Internal Health Check', () => {
      const internalHealthCheck: object = {
        status: 'success',
      };
      const action = loadActuatorInternalHealthCheckSuccess({internalHealthCheck});

      expect(action.type).toBe('[Monitoring] Load Actuator Internal Health Check Success');
      expect(action.internalHealthCheck).toEqual(internalHealthCheck);
    });
  });

  describe('loadActuatorInternalHealthCheckFailure', () => {
    it('should create an action for failed loading of Actuator Internal Health Check', () => {
      const errorResponse = new HttpErrorResponse({error: 'Error message', status: 404});
      const action = loadActuatorInternalHealthCheckFailure({errorResponse});

      expect(action.type).toBe('[Monitoring] Load Actuator Internal Health Check Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });
});
