import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Actions} from '@ngrx/effects';
import {StatisticEffects} from './statistic.effects';
import {ApiService} from '../../../services/api.service';
import {cold, hot} from 'jasmine-marbles';
import {HttpErrorResponse} from '@angular/common/http';
import {
  loadUserStatisticAction,
  loadUserStatisticFailure,
  loadUserStatisticSuccess
} from "./statistic.actions";
import {UsersStatisticRequest} from "../../api/model/usersStatisticRequest";
import {UsersStatisticResponse} from "../../api/model/usersStatisticResponse";

describe('StatisticEffects', () => {
  let actions$: Actions;
  let effects: StatisticEffects;
  let apiService: jasmine.SpyObj<ApiService>;


  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadUsersStatistic',
    ]);

    TestBed.configureTestingModule({
      providers: [
        StatisticEffects,
        provideMockActions(() => actions$),
        {provide: ApiService, useValue: apiServiceSpy},
      ],
    });

    effects = TestBed.inject(StatisticEffects);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });
  describe('loadUserStatistic$', () => {
    it('should return loadUserStatisticSuccess on successful load', () => {
      const usersStatisticRequest: UsersStatisticRequest = {
        userId: ''
      };
      const action = loadUserStatisticAction({usersStatisticRequest});
      const usersStatisticResponse = {all: 1, active: 2, blocked: 3} as UsersStatisticResponse;
      const completion = loadUserStatisticSuccess({usersStatisticResponse});

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {b: usersStatisticResponse});
      apiService.loadUsersStatistic.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadUserStatistic$).toBeObservable(expected);
    });

    it('should return loadUserStatisticFailure on error', () => {
      const usersStatisticRequest: UsersStatisticRequest = {
        userId: ''
      };
      const action = loadUserStatisticAction({usersStatisticRequest});
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = loadUserStatisticFailure({errorResponse});

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.loadUsersStatistic.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadUserStatistic$).toBeObservable(expected);
    });
  });
});

