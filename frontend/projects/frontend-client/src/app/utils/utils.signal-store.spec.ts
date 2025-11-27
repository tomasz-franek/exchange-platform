import {fakeAsync, TestBed} from '@angular/core/testing';
import {MockProvider} from 'ng-mocks';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {of, Subject, throwError} from 'rxjs';
import {patchState} from '@ngrx/signals';
import {unprotected} from '@ngrx/signals/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiService} from '../../services/api/api.service';
import {UtilStore} from './utils.signal-store';
import {BuildInfo} from '../api/model/buildInfo';


describe('UtilsSignalStore', () => {

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ApiService),
        MockProvider(MessageService),
        MockProvider(TranslateService)
      ],
    });
  });

  describe('loadBuildInfo', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadBuildInfo').and.returnValue(new Subject<any>());
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
      const apiService = TestBed.inject(ApiService);
      const buildInfo: BuildInfo = {
        buildTime: 'buildTime',
        branchName: 'branchName',
        commitHash: 'commitHash',
        commitTime: 'commitTime',
        moduleName: 'moduleName',
        versionNumber: 'versionNumber',
      };
      spyOn(apiService, 'loadBuildInfo').and.returnValue(of(buildInfo) as any);
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
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadBuildInfo').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
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
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
    }));
  })
})

