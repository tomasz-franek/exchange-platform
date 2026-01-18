import type { MockedObject } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { SystemService } from '../api/api/system.service';
import { BuildInfo } from '../api/model/buildInfo';
import { of } from 'rxjs';

describe('ApiService', () => {
  let apiService: ApiService;
  let systemService: MockedObject<SystemService>;

  beforeEach(() => {
    const systemServiceSpy = {
      loadBuildInfo: vi.fn().mockName('SystemService.loadBuildInfo'),
      configuration: vi.fn().mockName('SystemService.configuration'),
    };

    TestBed.configureTestingModule({
      providers: [
        ApiService,
        { provide: SystemService, useValue: systemServiceSpy },
      ],
    });
    apiService = TestBed.inject(ApiService);
    systemService = TestBed.inject(
      SystemService,
    ) as MockedObject<SystemService>;
  });

  it('should load build info', () => {
    const mockBuildInfo = {
      buildTime: 'buildTime',
      branchName: 'branchName',
      commitHash: 'commitHash',
      commitTime: 'commitTime',
      moduleName: 'moduleName',
      versionNumber: 'versionNumber',
    } as BuildInfo;
    systemService.loadBuildInfo.mockReturnValue(of(mockBuildInfo) as never);

    apiService.loadBuildInfo().subscribe((operations) => {
      expect(operations).toEqual(mockBuildInfo);
    });

    expect(systemService.loadBuildInfo).toHaveBeenCalled();
  });
});
