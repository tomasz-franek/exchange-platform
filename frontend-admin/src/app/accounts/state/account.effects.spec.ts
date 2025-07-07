import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Actions} from '@ngrx/effects';
import {AccountEffects} from './account.effects';
import {ApiService} from '../../services/api.service';
import {
  loadAccountListAction,
  loadAccountListFailure,
  loadAccountListSuccess
} from './account.actions';
import {UserAccount} from '../../api/model/userAccount';
import {cold, hot} from 'jasmine-marbles';
import {HttpErrorResponse} from '@angular/common/http';
import {UserAccountRequest} from '../../api/model/userAccountRequest';

describe('AccountEffects', () => {
  let actions$: Actions;
  let effects: AccountEffects;
  let apiService: jasmine.SpyObj<ApiService>;


  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadAccounts',
    ]);

    TestBed.configureTestingModule({
      providers: [
        AccountEffects,
        provideMockActions(() => actions$),
        {provide: ApiService, useValue: apiServiceSpy},
      ],
    });

    effects = TestBed.inject(AccountEffects);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });
  describe('listUserAccount$', () => {
    it('should return loadAccountBalanceListSuccess on successful load', () => {
      const userAccountRequest: UserAccountRequest = {userId: '1'};
      const action = loadAccountListAction({userAccountRequest});
      const userAccounts = [
        {id: '1', currency: 'EUR', version: 2},
      ] as UserAccount[];
      const completion = loadAccountListSuccess({userAccounts});

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {b: userAccounts});
      apiService.loadAccounts.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadUserAccount$).toBeObservable(expected);
    });

    it('should return loadAccountBalanceListFailure on error', () => {
      const userAccountRequest: UserAccountRequest = {userId: '1'};
      const action = loadAccountListAction({userAccountRequest});
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = loadAccountListFailure({
        error: errorResponse,
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.loadAccounts.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadUserAccount$).toBeObservable(expected);
    });
  });
});

