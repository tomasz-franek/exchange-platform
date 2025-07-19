import { Actions } from '@ngrx/effects';

import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';

import { cold, hot } from 'jasmine-marbles';
import { ApiService } from '../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { SystemEffects } from './system.effects';
import {
  loadBuildInfoAction,
  loadBuildInfoActionSuccess,
  loadSystemMessageListAction,
  loadSystemMessageListActionSuccess,
} from './system.actions';
import { SystemMessage } from '../../api/model/systemMessage';
import { BuildInfo } from '../../api/model/buildInfo';

describe('SystemEffects', () => {
  let effects: SystemEffects;
  let actions$: Actions;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadBuildInfo',
      'loadSystemMessageList',
    ]);
    TestBed.configureTestingModule({
      providers: [
        SystemEffects,
        provideMockActions(() => actions$),
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    });

    effects = TestBed.inject(SystemEffects);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should return loadSystemMessageListActionSuccess on successful systemMessages', () => {
    const systemMessageList: SystemMessage[] = [
      { id: '1', messageText: 'a', priority: 1 },
      { id: '2', messageText: 'b', priority: 2 },
    ];

    const action = loadSystemMessageListAction();
    const outcome = loadSystemMessageListActionSuccess({ systemMessageList });

    actions$ = hot('-a', { a: action });
    apiService.loadSystemMessageList.and.returnValue(
      of(systemMessageList) as any,
    );
    const expected = cold('-c', { c: outcome });
    expect(effects.loadSystemMessageList$).toBeObservable(expected);
  });

  it('should return loadSystemMessageListActionError on failed loadSystemMessageList', () => {
    const error = new HttpErrorResponse({});
    apiService.loadSystemMessageList.and.returnValue(throwError(() => error));
    actions$ = of(loadSystemMessageListAction());

    effects.loadSystemMessageList$.subscribe((action) => {
      expect(action).toEqual({
        type: '[System] Load System Message List Action Error',
        error,
      });
      expect(apiService.loadSystemMessageList).toHaveBeenCalled();
    });
  });

  it('should return loadBuildInfoActionSuccess on successful buildInfo', () => {
    const buildInfo: BuildInfo = {
      buildTime: 'buildTime',
      branchName: 'branchName',
      commitHash: 'commitHash',
      commitTime: 'commitTime',
      moduleName: 'moduleName',
      versionNumber: 'versionNumber',
    };

    const action = loadBuildInfoAction();
    const outcome = loadBuildInfoActionSuccess({ buildInfo });

    actions$ = hot('-a', { a: action });
    apiService.loadBuildInfo.and.returnValue(of(buildInfo) as any);
    const expected = cold('-c', { c: outcome });
    expect(effects.loadBuildInfo$).toBeObservable(expected);
  });

  it('should return loadSystemMessageListActionError on failed loadSystemMessageList', () => {
    const error = new HttpErrorResponse({});
    apiService.loadBuildInfo.and.returnValue(throwError(() => error));
    actions$ = of(loadBuildInfoAction());

    effects.loadBuildInfo$.subscribe((action) => {
      expect(action).toEqual({
        type: '[System] Load Build Info Action Error',
        error,
      });
      expect(apiService.loadBuildInfo).toHaveBeenCalled();
    });
  });
});
