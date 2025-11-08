import { TestBed } from '@angular/core/testing';
import { MonitoringService } from './monitoring.service';
import { ActuatorAdminService } from '../../api/api/actuatorAdmin.service';
import { ActuatorInternalService } from '../../api/api/actuatorInternal.service';
import { of } from 'rxjs';
import { ActuatorExternalService } from '../../api/api/actuatorExternal.service';

describe('MonitoringService', () => {
  let apiService: MonitoringService;
  let actuatorAdminService: jasmine.SpyObj<ActuatorAdminService>;
  let actuatorExternalService: jasmine.SpyObj<ActuatorExternalService>;
  let actuatorInternalService: jasmine.SpyObj<ActuatorInternalService>;

  beforeEach(() => {
    const actuatorAdminServiceSpy = jasmine.createSpyObj(
      'ActuatorAdminService',
      ['loadActuatorAdminHealthCheck', 'configuration'],
    );
    const actuatorExternalServiceSpy = jasmine.createSpyObj(
      'ActuatorExternalService',
      ['loadActuatorExternalHealthCheck', 'configuration'],
    );
    const actuatorInternalServiceSpy = jasmine.createSpyObj(
      'ActuatorInternalService',
      ['loadActuatorInternalHealthCheck', 'configuration'],
    );

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
    ) as jasmine.SpyObj<ActuatorAdminService>;
    actuatorExternalService = TestBed.inject(
      ActuatorExternalService,
    ) as jasmine.SpyObj<ActuatorExternalService>;
    actuatorInternalService = TestBed.inject(
      ActuatorInternalService,
    ) as jasmine.SpyObj<ActuatorInternalService>;
  });

  it('should load Admin Service Health Check', () => {
    const healthCheck: object = {
      status: 'success',
    };
    actuatorAdminService.loadActuatorAdminHealthCheck.and.returnValue(
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
    actuatorExternalService.loadActuatorExternalHealthCheck.and.returnValue(
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
    actuatorInternalService.loadActuatorInternalHealthCheck.and.returnValue(
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
