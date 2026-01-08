import {fakeAsync, TestBed} from '@angular/core/testing';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {of, Subject, throwError} from 'rxjs';
import {patchState} from '@ngrx/signals';
import {unprotected} from '@ngrx/signals/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {MonitoringStore} from './monitoring.signal-store';
import {MonitoringService} from './services/monitoring.service';

describe('Monitoring Signal Store', () => {
  let monitoringService: jasmine.SpyObj<MonitoringService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let translateService: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', [
      'instant',
    ]);
    const monitoringServiceSpy = jasmine.createSpyObj('MonitoringService', [
      'loadActuatorExternalHealthCheck',
      'loadActuatorAdminHealthCheck',
      'loadActuatorInternalHealthCheck',
    ]);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);
    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: MonitoringService, useValue: monitoringServiceSpy },
      ],
    });

    monitoringService = TestBed.inject(
      MonitoringService,
    ) as jasmine.SpyObj<MonitoringService>;
    messageService = TestBed.inject(
      MessageService,
    ) as jasmine.SpyObj<MessageService>;
    translateService = TestBed.inject(
      TranslateService,
    ) as jasmine.SpyObj<TranslateService>;
  });

  describe('loadActuatorAdminHealthCheck', () => {
    it('should set isLoading true', () => {
      // given
      monitoringService.loadActuatorAdminHealthCheck.and.returnValue(
        new Subject<any>(),
      );
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
      const status = { status: 'UP' };
      monitoringService.loadActuatorAdminHealthCheck.and.returnValue(
        of(status) as any,
      );
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
      translateService.instant.and.returnValue('error');
      monitoringService.loadActuatorAdminHealthCheck.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const monitoringStore = TestBed.inject(MonitoringStore);
      patchState(unprotected(monitoringStore), {
        adminHealthCheck: { id: 1 },
        isLoading: false,
      });

      // when
      monitoringStore.loadActuatorAdminHealthCheck();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(monitoringStore.adminHealthCheck()).toEqual({ status: 'Unknown' });
      expect(monitoringStore.isLoading()).toBeFalse();
    }));
  });

  describe('loadActuatorInternalHealthCheck', () => {
    it('should set isLoading true', () => {
      // given
      monitoringService.loadActuatorInternalHealthCheck.and.returnValue(
        new Subject<any>(),
      );
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
      const status = { status: 'UP' };
      monitoringService.loadActuatorInternalHealthCheck.and.returnValue(
        of(status) as any,
      );
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
      translateService.instant.and.returnValue('error');
      monitoringService.loadActuatorInternalHealthCheck.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const monitoringStore = TestBed.inject(MonitoringStore);
      patchState(unprotected(monitoringStore), {
        internalHealthCheck: { id: 1 },
        isLoading: false,
      });

      // when
      monitoringStore.loadActuatorInternalHealthCheck();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(monitoringStore.internalHealthCheck()).toEqual({
        status: 'Unknown',
      });
      expect(monitoringStore.isLoading()).toBeFalse();
    }));
  });

  describe('loadActuatorExternalHealthCheck', () => {
    it('should set isLoading true', () => {
      // given
      monitoringService.loadActuatorExternalHealthCheck.and.returnValue(
        new Subject<any>(),
      );
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
      const status = { status: 'UP' };
      monitoringService.loadActuatorExternalHealthCheck.and.returnValue(
        of(status) as any,
      );
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
      translateService.instant.and.returnValue('error');
      monitoringService.loadActuatorExternalHealthCheck.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const monitoringStore = TestBed.inject(MonitoringStore);
      patchState(unprotected(monitoringStore), {
        internalHealthCheck: { id: 1 },
        isLoading: false,
      });

      // when
      monitoringStore.loadActuatorExternalHealthCheck();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(monitoringStore.externalHealthCheck()).toEqual({
        status: 'Unknown',
      });
      expect(monitoringStore.isLoading()).toBeFalse();
    }));
  });
});
