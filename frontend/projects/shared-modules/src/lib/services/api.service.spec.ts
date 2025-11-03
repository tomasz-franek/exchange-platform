import { TestBed } from '@angular/core/testing';
import { ApiService } from './api.service';
import { SystemService } from '../api/api/system.service';
import { BuildInfo } from '../api/model/buildInfo';
import { of } from 'rxjs';

import any = jasmine.any;

describe('ApiService', () => {
  let apiService: ApiService;
  let systemService: jasmine.SpyObj<SystemService>;

  beforeEach(() => {
    const systemServiceSpy = jasmine.createSpyObj('SystemService', [
      'loadBuildInfo',
      'configuration',
    ]);


    TestBed.configureTestingModule({
      providers: [
        ApiService,
        { provide: SystemService, useValue: systemServiceSpy },
      ],
    });
    apiService = TestBed.inject(ApiService);
    systemService = TestBed.inject(
      SystemService,
    ) as jasmine.SpyObj<SystemService>;

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
    systemService.loadBuildInfo.and.returnValue(of(mockBuildInfo) as never);

    apiService.loadBuildInfo().subscribe((operations) => {
      expect(operations).toEqual(mockBuildInfo);
    });

    expect(systemService.loadBuildInfo).toHaveBeenCalled();
  });
});
