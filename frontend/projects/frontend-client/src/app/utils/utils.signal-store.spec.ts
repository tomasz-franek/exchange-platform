import { TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject, throwError } from 'rxjs';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiService } from '../../services/api/api.service';
import { UtilStore } from './utils.signal-store';
import { BuildInfo } from '../api/model/buildInfo';

describe('UtilsSignalStore', () => {
  let apiService: jasmine.SpyObj<ApiService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let translateService: jasmine.SpyObj<TranslateService>;

  beforeEach(() => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', [
      'instant',
    ]);
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['loadBuildInfo']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    });

    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    messageService = TestBed.inject(
      MessageService,
    ) as jasmine.SpyObj<MessageService>;
    translateService = TestBed.inject(
      TranslateService,
    ) as jasmine.SpyObj<TranslateService>;
  });

  describe('loadBuildInfo', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadBuildInfo.and.returnValue(new Subject<any>());
      const utilsSignalStore = TestBed.inject(UtilStore);
      patchState(unprotected(utilsSignalStore), {
        isLoading: false,
      });

      // when
      utilsSignalStore.loadBuildInfo();

      // then
      expect(utilsSignalStore.isLoading()).toBeTrue();
    });

    it('should set buildInfo when backend return data', () => {
      // given
      const buildInfo: BuildInfo = {
        buildTime: 'buildTime',
        branchName: 'branchName',
        commitHash: 'commitHash',
        commitTime: 'commitTime',
        moduleName: 'moduleName',
        versionNumber: 'versionNumber',
      };
      apiService.loadBuildInfo.and.returnValue(of(buildInfo) as any);
      const utilsSignalStore = TestBed.inject(UtilStore);
      patchState(unprotected(utilsSignalStore), {
        buildInfo: {} as BuildInfo,
        isLoading: false,
      });

      // when
      utilsSignalStore.loadBuildInfo();

      // then
      expect(utilsSignalStore.buildInfo()).toEqual(buildInfo);
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.loadBuildInfo.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const utilsSignalStore = TestBed.inject(UtilStore);
      patchState(unprotected(utilsSignalStore), {
        buildInfo: {} as BuildInfo,
        isLoading: false,
      });

      // when
      utilsSignalStore.loadBuildInfo();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
    });
  });
});
