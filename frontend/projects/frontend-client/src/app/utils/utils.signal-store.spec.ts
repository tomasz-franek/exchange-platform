import type { MockedObject } from 'vitest';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeAsync, TestBed } from '@angular/core/testing';
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
  let apiService: MockedObject<ApiService>;
  let messageService: MockedObject<MessageService>;
  let translateService: MockedObject<TranslateService>;

  beforeEach(async () => {
    const translateServiceSpy = {
      instant: vi.fn().mockName('TranslateService.instant'),
    };
    const apiServiceSpy = {
      loadBuildInfo: vi.fn().mockName('ApiService.loadBuildInfo'),
    };
    const messageServiceSpy = {
      add: vi.fn().mockName('MessageService.add'),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    });

    apiService = TestBed.inject(ApiService) as MockedObject<ApiService>;
    messageService = TestBed.inject(
      MessageService,
    ) as MockedObject<MessageService>;
    translateService = TestBed.inject(
      TranslateService,
    ) as MockedObject<TranslateService>;
  });

  describe('loadBuildInfo', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadBuildInfo.mockReturnValue(new Subject<any>());
      const utilsSignalStore = TestBed.inject(UtilStore);
      patchState(unprotected(utilsSignalStore), {
        isLoading: false,
      });

      // when
      utilsSignalStore.loadBuildInfo();

      // then
      expect(utilsSignalStore.isLoading()).toBe(true);
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
      apiService.loadBuildInfo.mockReturnValue(of(buildInfo) as any);
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

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.loadBuildInfo.mockReturnValue(
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
    }));
  });
});
