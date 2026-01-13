import type { MockedObject } from 'vitest';
import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { MonitoringService } from './monitoring.service';
import { ActuatorAdminService } from '../../api/api/actuatorAdmin.service';
import { ActuatorInternalService } from '../../api/api/actuatorInternal.service';
import { of } from 'rxjs';
import { ActuatorExternalService } from '../../api/api/actuatorExternal.service';

describe('MonitoringService', () => {
  let apiService: MonitoringService;
  let actuatorAdminService: MockedObject<ActuatorAdminService>;
  let actuatorExternalService: MockedObject<ActuatorExternalService>;
  let actuatorInternalService: MockedObject<ActuatorInternalService>;

  beforeEach(() => {
    const actuatorAdminServiceSpy = {
      loadActuatorAdminHealthCheck: vi
        .fn()
        .mockName('ActuatorAdminService.loadActuatorAdminHealthCheck'),
      configuration: vi.fn().mockName('ActuatorAdminService.configuration'),
    };
    const actuatorExternalServiceSpy = {
      loadActuatorExternalHealthCheck: vi
        .fn()
        .mockName('ActuatorExternalService.loadActuatorExternalHealthCheck'),
      configuration: vi.fn().mockName('ActuatorExternalService.configuration'),
    };
    const actuatorInternalServiceSpy = {
      loadActuatorInternalHealthCheck: vi
        .fn()
        .mockName('ActuatorInternalService.loadActuatorInternalHealthCheck'),
      configuration: vi.fn().mockName('ActuatorInternalService.configuration'),
    };

    TestBed.configureTestingModule({
      providers: [
        MonitoringService,
        { provide: ActuatorAdminService, useValue: actuatorAdminServiceSpy },
        {
          provide: ActuatorExternalService,
          useValue: actuatorExternalServiceSpy,
        },
        {
          provide: ActuatorInternalService,
          useValue: actuatorInternalServiceSpy,
        },
      ],
    });
    apiService = TestBed.inject(MonitoringService);
    actuatorAdminService = TestBed.inject(
      ActuatorAdminService,
    ) as MockedObject<ActuatorAdminService>;
    actuatorExternalService = TestBed.inject(
      ActuatorExternalService,
    ) as MockedObject<ActuatorExternalService>;
    actuatorInternalService = TestBed.inject(
      ActuatorInternalService,
    ) as MockedObject<ActuatorInternalService>;
  });

  it('should load Admin Service Health Check', () => {
    const healthCheck: object = {
      status: 'success',
    };
    actuatorAdminService.loadActuatorAdminHealthCheck.mockReturnValue(
      of(healthCheck) as any,
    );

    apiService.loadActuatorAdminHealthCheck().subscribe((operations) => {
      expect(operations).toEqual(healthCheck);
    });

    expect(
      actuatorAdminService.loadActuatorAdminHealthCheck,
    ).toHaveBeenCalled();
  });

  it('should load External Service Health Check', () => {
    const healthCheck: object = {
      status: 'success',
    };
    actuatorExternalService.loadActuatorExternalHealthCheck.mockReturnValue(
      of(healthCheck) as any,
    );

    apiService.loadActuatorExternalHealthCheck().subscribe((operations) => {
      expect(operations).toEqual(healthCheck);
    });

    expect(
      actuatorExternalService.loadActuatorExternalHealthCheck,
    ).toHaveBeenCalled();
  });

  it('should load Internal Service Health Check', () => {
    const healthCheck: object = {
      status: 'success',
    };
    actuatorInternalService.loadActuatorInternalHealthCheck.mockReturnValue(
      of(healthCheck) as any,
    );

    apiService.loadActuatorInternalHealthCheck().subscribe((operations) => {
      expect(operations).toEqual(healthCheck);
    });

    expect(
      actuatorInternalService.loadActuatorInternalHealthCheck,
    ).toHaveBeenCalled();
  });
});
