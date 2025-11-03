import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Actions} from '@ngrx/effects';
import {UtilEffects} from './util.effects';
import {ApiService} from '../services/api.service';
import {cold, hot} from 'jasmine-marbles';
import {HttpErrorResponse} from '@angular/common/http';
import {loadBuildInfoAction, loadBuildInfoFailure, loadBuildInfoSuccess} from './util.actions';
import {BuildInfo} from '../api/model/buildInfo';

describe('UtilEffects', () => {
  let actions$: Actions;
  let effects: UtilEffects;
  let apiService: jasmine.SpyObj<ApiService>;


  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadBuildInfo',
    ]);

    TestBed.configureTestingModule({
      providers: [
        UtilEffects,
        provideMockActions(() => actions$),
        {provide: ApiService, useValue: apiServiceSpy},
      ],
    });

    effects = TestBed.inject(UtilEffects);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });
  describe('loadBuildInfoAction', () => {
    it('should return loadBuildInfoSuccess on successful load', () => {
      const action = loadBuildInfoAction();
      const buildInfo: BuildInfo = {
        buildTime: 'buildTime',
        commitTime: 'commitTime',
        commitHash: 'commitHash',
        branchName: 'branchName',
        moduleName: 'moduleName',
        versionNumber: 'versionNumber'
      };
      const completion = loadBuildInfoSuccess({buildInfo});

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {b: buildInfo});
      apiService.loadBuildInfo.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadBuildInfo$).toBeObservable(expected);
    });

    it('should return loadBuildInfoFailure on error', () => {
      const action = loadBuildInfoAction();
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = loadBuildInfoFailure({
        errorResponse,
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.loadBuildInfo.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadBuildInfo$).toBeObservable(expected);
    });
  });
});

