import {Actions} from "@ngrx/effects";
import {MonitoringEffects} from "./monitoring.effects";
import {TestBed} from "@angular/core/testing";
import {provideMockActions} from "@ngrx/effects/testing";
import {cold, hot} from "jasmine-marbles";
import {HttpErrorResponse} from "@angular/common/http";
import {
  loadActuatorAdminHealthCheckAction,
  loadActuatorAdminHealthCheckFailure,
  loadActuatorAdminHealthCheckSuccess,
  loadActuatorExternalHealthCheckAction,
  loadActuatorExternalHealthCheckFailure,
  loadActuatorExternalHealthCheckSuccess,
  loadActuatorInternalHealthCheckAction,
  loadActuatorInternalHealthCheckFailure,
  loadActuatorInternalHealthCheckSuccess,
} from "./monitoring.actions";
import {MonitoringService} from '../services/monitoring.service';

describe('MonitoringEffects', () => {
  let actions$: Actions;
  let effects: MonitoringEffects;
  let apiService: jasmine.SpyObj<MonitoringService>;

  beforeEach(() => {
    const monitoringServiceSpy = jasmine.createSpyObj('MonitoringService', [
      'loadActuatorAdminHealthCheck',
      'loadActuatorExternalHealthCheck',
      'loadActuatorInternalHealthCheck'
    ]);

    TestBed.configureTestingModule({
      providers: [
        MonitoringEffects,
        provideMockActions(() => actions$),
        {provide: MonitoringService, useValue: monitoringServiceSpy},
      ],
    });

    effects = TestBed.inject(MonitoringEffects);
    apiService = TestBed.inject(MonitoringService) as jasmine.SpyObj<MonitoringService>;
  });

  describe('loadAdminHealthCheck$', () => {
    it('should return loadActuatorAdminHealthCheckSuccess on successful save', () => {
      const action = loadActuatorAdminHealthCheckAction();
      const adminHealthCheck: object = {
        status: 'success',
      };
      const completion = loadActuatorAdminHealthCheckSuccess({adminHealthCheck});

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {b: adminHealthCheck});
      apiService.loadActuatorAdminHealthCheck.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadAdminHealthCheck$).toBeObservable(expected);
    });

    it('should return loadActuatorAdminHealthCheckFailure on error when save', () => {
      const action = loadActuatorAdminHealthCheckAction();
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = loadActuatorAdminHealthCheckFailure({
        errorResponse
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.loadActuatorAdminHealthCheck.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadAdminHealthCheck$).toBeObservable(expected);
    });
  });

  describe('loadInternalHealthCheck$', () => {
    it('should return loadActuatorInternalHealthCheckSuccess on successful save', () => {
      const action = loadActuatorInternalHealthCheckAction();
      const internalHealthCheck: object = {
        status: 'success',
      };
      const completion = loadActuatorInternalHealthCheckSuccess({internalHealthCheck});

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {b: internalHealthCheck});
      apiService.loadActuatorInternalHealthCheck.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadInternalHealthCheck$).toBeObservable(expected);
    });

    it('should return loadActuatorInternalHealthCheckFailure on error when save', () => {
      const action = loadActuatorInternalHealthCheckAction();
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = loadActuatorInternalHealthCheckFailure({
        errorResponse
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.loadActuatorInternalHealthCheck.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadInternalHealthCheck$).toBeObservable(expected);
    });
  });

  describe('loadExternalHealthCheck$', () => {
    it('should return loadActuatorExternalHealthCheckSuccess on successful save', () => {
      const action = loadActuatorExternalHealthCheckAction();
      const externalHealthCheck: object = {
        status: 'success',
      };
      const completion = loadActuatorExternalHealthCheckSuccess({externalHealthCheck});

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {b: externalHealthCheck});
      apiService.loadActuatorExternalHealthCheck.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadExternalHealthCheck$).toBeObservable(expected);
    });

    it('should return loadActuatorExternalHealthCheckFailure on error when save', () => {
      const action = loadActuatorExternalHealthCheckAction();
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = loadActuatorExternalHealthCheckFailure({
        errorResponse
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.loadActuatorExternalHealthCheck.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadExternalHealthCheck$).toBeObservable(expected);
    });
  });
});
