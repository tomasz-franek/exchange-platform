import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Actions} from '@ngrx/effects';
import {AccountEffects} from './account.effects';
import {ApiService} from '../../services/api.service';
import {
  loadAccountListAction,
  loadAccountListFailure,
  loadAccountListSuccess,
  saveDeposit,
  saveDepositFailure,
  saveDepositSuccess,
  saveWithdraw,
  saveWithdrawFailure,
  saveWithdrawSuccess
} from './account.actions';
import {UserAccount} from '../../api/model/userAccount';
import {cold, hot} from 'jasmine-marbles';
import {HttpErrorResponse} from '@angular/common/http';
import {UserAccountRequest} from '../../api/model/userAccountRequest';
import {
  UserAccountOperation
} from '../../../../../frontend-client/src/app/api/model/userAccountOperation';
import {ToastrService} from "ngx-toastr";

describe('AccountEffects', () => {
  let actions$: Actions;
  let effects: AccountEffects;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastrService: jasmine.SpyObj<ToastrService>;


  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadAccounts',
      'saveAccountDeposit',
      'saveWithdrawRequest'
    ]);

    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', [
      'info',
      'error',
    ]);

    TestBed.configureTestingModule({
      providers: [
        AccountEffects,
        provideMockActions(() => actions$),
        {provide: ApiService, useValue: apiServiceSpy},
        {provide: ToastrService, useValue: toastrServiceSpy},
      ],
    });

    effects = TestBed.inject(AccountEffects);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    toastrService = TestBed.inject(
        ToastrService,
    ) as jasmine.SpyObj<ToastrService>;
  });
  describe('loadUserAccount$', () => {
    it('should return loadAccountListSuccess on successful load', () => {
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

    it('should return loadAccountListFailure on error', () => {
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

  describe('saveDeposit$', () => {
    it('should return saveDepositSuccess on successful account-deposit', () => {
      const depositRequest = {} as UserAccountOperation;
      const action = saveDeposit({depositRequest});
      const completion = saveDepositSuccess();

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {});
      apiService.saveAccountDeposit.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.saveDeposit$).toBeObservable(expected);
      expect(toastrService.info).toHaveBeenCalledWith(
          'Deposit successfully sent',
      );
    });

    it('should return saveDepositFailure on error', () => {
      const depositRequest = {} as UserAccountOperation;
      const action = saveDeposit({depositRequest});
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = saveDepositFailure({error: errorResponse});

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.saveAccountDeposit.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.saveDeposit$).toBeObservable(expected);
      expect(toastrService.error).toHaveBeenCalledWith(
          'Error occurred while saving account-deposit request',
      );
    });
  });

  describe('saveWithdraw$', () => {
    it('should return saveWithdrawSuccess on successful withdrawal', () => {
      const withdrawRequest = {} as UserAccountOperation;
      const action = saveWithdraw({withdrawRequest});
      const completion = saveWithdrawSuccess();

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {});
      apiService.saveWithdrawRequest.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.saveWithdraw$).toBeObservable(expected);
      expect(toastrService.info).toHaveBeenCalledWith(
          'Withdraw request successfully sent',
      );
    });
    it('should return saveWithdrawFailure on error', () => {
      const withdrawRequest = {} as UserAccountOperation;
      const action = saveWithdraw({withdrawRequest});
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = saveWithdrawFailure({error: errorResponse});

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.saveWithdrawRequest.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.saveWithdraw$).toBeObservable(expected);
      expect(toastrService.error).toHaveBeenCalledWith(
          'Error occurred while sending withdraw request',
      );
    });
  });
});

