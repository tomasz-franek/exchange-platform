import {fakeAsync, TestBed} from '@angular/core/testing';
import {MockProvider} from 'ng-mocks';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {of, Subject, throwError} from 'rxjs';
import {patchState} from '@ngrx/signals';
import {unprotected} from '@ngrx/signals/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {MonitoringStore} from './monitoring.signal-store';
import {MonitoringService} from './services/monitoring.service';

describe('Monitoring Signal Store', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(MessageService),
        MockProvider(MonitoringService),
        MockProvider(TranslateService)
      ],
    });
  });

  describe('loadActuatorAdminHealthCheck', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(MonitoringService);
      spyOn(service, 'loadActuatorAdminHealthCheck').and.returnValue(new Subject<any>());
      const monitoringStore = TestBed.inject(MonitoringStore);
      patchState(unprotected(monitoringStore), {
        isLoading: false,
      });

      // when
      monitoringStore.loadActuatorAdminHealthCheck();

      // then
      expect(monitoringStore.isLoading()).toBeTrue();
    });

    it('should set adminHealthCheck when backend return data', () => {
      // given
      const apiService = TestBed.inject(MonitoringService);
      const status = {status: 'UP'};
      spyOn(apiService, 'loadActuatorAdminHealthCheck').and.returnValue(of(status) as any);
      const monitoringStore = TestBed.inject(MonitoringStore);
      patchState(unprotected(monitoringStore), {
        adminHealthCheck: {},
        isLoading: false,
      });

      // when
      monitoringStore.loadActuatorAdminHealthCheck();

      // then
      expect(monitoringStore.adminHealthCheck()).toEqual(status);
      expect(monitoringStore.isLoading()).toBeFalse();
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(MonitoringService);
      spyOn(apiService, 'loadActuatorAdminHealthCheck').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const monitoringStore = TestBed.inject(MonitoringStore);
      patchState(unprotected(monitoringStore), {
        adminHealthCheck: {id: 1},
        isLoading: false,
      });

      // when
      monitoringStore.loadActuatorAdminHealthCheck();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(monitoringStore.adminHealthCheck()).toEqual({status: 'Unknown'});
      expect(monitoringStore.isLoading()).toBeFalse();
    }));
  })

  describe('loadActuatorInternalHealthCheck', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(MonitoringService);
      spyOn(service, 'loadActuatorInternalHealthCheck').and.returnValue(new Subject<any>());
      const monitoringStore = TestBed.inject(MonitoringStore);
      patchState(unprotected(monitoringStore), {
        isLoading: false,
      });

      // when
      monitoringStore.loadActuatorInternalHealthCheck();

      // then
      expect(monitoringStore.isLoading()).toBeTrue();
    });

    it('should set internalHealthCheck when backend return data', () => {
      // given
      const apiService = TestBed.inject(MonitoringService);
      const status = {status: 'UP'};
      spyOn(apiService, 'loadActuatorInternalHealthCheck').and.returnValue(of(status) as any);
      const monitoringStore = TestBed.inject(MonitoringStore);
      patchState(unprotected(monitoringStore), {
        internalHealthCheck: {},
        isLoading: false,
      });

      // when
      monitoringStore.loadActuatorInternalHealthCheck();

      // then
      expect(monitoringStore.internalHealthCheck()).toEqual(status);
      expect(monitoringStore.isLoading()).toBeFalse();
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(MonitoringService);
      spyOn(apiService, 'loadActuatorInternalHealthCheck').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const monitoringStore = TestBed.inject(MonitoringStore);
      patchState(unprotected(monitoringStore), {
        internalHealthCheck: {id: 1},
        isLoading: false,
      });

      // when
      monitoringStore.loadActuatorInternalHealthCheck();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(monitoringStore.internalHealthCheck()).toEqual({status: 'Unknown'});
      expect(monitoringStore.isLoading()).toBeFalse();
    }));
  })

  describe('loadActuatorExternalHealthCheck', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(MonitoringService);
      spyOn(service, 'loadActuatorExternalHealthCheck').and.returnValue(new Subject<any>());
      const monitoringStore = TestBed.inject(MonitoringStore);
      patchState(unprotected(monitoringStore), {
        isLoading: false,
      });

      // when
      monitoringStore.loadActuatorExternalHealthCheck();

      // then
      expect(monitoringStore.isLoading()).toBeTrue();
    });

    it('should set externalHealthCheck when backend return data', () => {
      // given
      const apiService = TestBed.inject(MonitoringService);
      const status = {status: 'UP'};
      spyOn(apiService, 'loadActuatorExternalHealthCheck').and.returnValue(of(status) as any);
      const monitoringStore = TestBed.inject(MonitoringStore);
      patchState(unprotected(monitoringStore), {
        internalHealthCheck: {},
        isLoading: false,
      });

      // when
      monitoringStore.loadActuatorExternalHealthCheck();

      // then
      expect(monitoringStore.externalHealthCheck()).toEqual(status);
      expect(monitoringStore.isLoading()).toBeFalse();
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(MonitoringService);
      spyOn(apiService, 'loadActuatorExternalHealthCheck').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const monitoringStore = TestBed.inject(MonitoringStore);
      patchState(unprotected(monitoringStore), {
        internalHealthCheck: {id: 1},
        isLoading: false,
      });

      // when
      monitoringStore.loadActuatorExternalHealthCheck();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(monitoringStore.externalHealthCheck()).toEqual({status: 'Unknown'});
      expect(monitoringStore.isLoading()).toBeFalse();
    }));
  })
})
