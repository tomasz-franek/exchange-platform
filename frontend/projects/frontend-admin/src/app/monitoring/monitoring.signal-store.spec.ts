import type { MockedObject } from 'vitest';
import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject, throwError } from 'rxjs';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { MonitoringStore } from './monitoring.signal-store';
import { MonitoringService } from './services/monitoring.service';

describe('Monitoring Signal Store', () => {
  let monitoringService: MockedObject<MonitoringService>;
  let messageService: MockedObject<MessageService>;
  let translateService: MockedObject<TranslateService>;

  beforeEach(async () => {
    const translateServiceSpy = {
      instant: vi.fn().mockName('TranslateService.instant'),
    };
    const monitoringServiceSpy = {
      loadActuatorExternalHealthCheck: vi
        .fn()
        .mockName('MonitoringService.loadActuatorExternalHealthCheck'),
      loadActuatorAdminHealthCheck: vi
        .fn()
        .mockName('MonitoringService.loadActuatorAdminHealthCheck'),
      loadActuatorInternalHealthCheck: vi
        .fn()
        .mockName('MonitoringService.loadActuatorInternalHealthCheck'),
    };
    const messageServiceSpy = {
      add: vi.fn().mockName('MessageService.add'),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: MonitoringService, useValue: monitoringServiceSpy },
      ],
    });

    monitoringService = TestBed.inject(
      MonitoringService,
    ) as MockedObject<MonitoringService>;
    messageService = TestBed.inject(
      MessageService,
    ) as MockedObject<MessageService>;
    translateService = TestBed.inject(
      TranslateService,
    ) as MockedObject<TranslateService>;
  });

  describe('loadActuatorAdminHealthCheck', () => {
    it('should set isLoading true', () => {
      // given
      monitoringService.loadActuatorAdminHealthCheck.mockReturnValue(
        new Subject<any>(),
      );
      const monitoringStore = TestBed.inject(MonitoringStore);
      patchState(unprotected(monitoringStore), {
        isLoading: false,
      });

      // when
      monitoringStore.loadActuatorAdminHealthCheck();

      // then
      expect(monitoringStore.isLoading()).toBe(true);
    });

    it('should set adminHealthCheck when backend return data', () => {
      // given
      const status = { status: 'UP' };
      monitoringService.loadActuatorAdminHealthCheck.mockReturnValue(
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
      expect(monitoringStore.isLoading()).toBe(false);
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.mockReturnValue('error');
      monitoringService.loadActuatorAdminHealthCheck.mockReturnValue(
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
      expect(monitoringStore.isLoading()).toBe(false);
    });
  });

  describe('loadActuatorInternalHealthCheck', () => {
    it('should set isLoading true', () => {
      // given
      monitoringService.loadActuatorInternalHealthCheck.mockReturnValue(
        new Subject<any>(),
      );
      const monitoringStore = TestBed.inject(MonitoringStore);
      patchState(unprotected(monitoringStore), {
        isLoading: false,
      });

      // when
      monitoringStore.loadActuatorInternalHealthCheck();

      // then
      expect(monitoringStore.isLoading()).toBe(true);
    });

    it('should set internalHealthCheck when backend return data', () => {
      // given
      const status = { status: 'UP' };
      monitoringService.loadActuatorInternalHealthCheck.mockReturnValue(
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
      expect(monitoringStore.isLoading()).toBe(false);
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.mockReturnValue('error');
      monitoringService.loadActuatorInternalHealthCheck.mockReturnValue(
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
      expect(monitoringStore.isLoading()).toBe(false);
    });
  });

  describe('loadActuatorExternalHealthCheck', () => {
    it('should set isLoading true', () => {
      // given
      monitoringService.loadActuatorExternalHealthCheck.mockReturnValue(
        new Subject<any>(),
      );
      const monitoringStore = TestBed.inject(MonitoringStore);
      patchState(unprotected(monitoringStore), {
        isLoading: false,
      });

      // when
      monitoringStore.loadActuatorExternalHealthCheck();

      // then
      expect(monitoringStore.isLoading()).toBe(true);
    });

    it('should set externalHealthCheck when backend return data', () => {
      // given
      const status = { status: 'UP' };
      monitoringService.loadActuatorExternalHealthCheck.mockReturnValue(
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
      expect(monitoringStore.isLoading()).toBe(false);
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.mockReturnValue('error');
      monitoringService.loadActuatorExternalHealthCheck.mockReturnValue(
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
      expect(monitoringStore.isLoading()).toBe(false);
    });
  });
});
