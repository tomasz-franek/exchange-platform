import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { AccountEffects } from './account.effects';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { cold, hot } from 'jasmine-marbles';
import {
  loadAccountBalanceListAction,
  loadAccountBalanceListFailure,
  loadAccountBalanceListSuccess,
  saveDeposit,
  saveDepositFailure,
  saveDepositSuccess,
  saveUserAccount,
  saveUserAccountFailure,
  saveUserAccountSuccess,
  saveWithdraw,
  saveWithdrawFailure,
  saveWithdrawSuccess,
} from './account.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { UserAccount } from '../../api/model/userAccount';
import { UserAccountOperation } from '../../api/model/userAccountOperation';
import { AccountBalance } from '../../api/model/accountBalance';

describe('AccountEffects', () => {
  let actions$: Actions;
  let effects: AccountEffects;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'saveAccountDeposit',
      'saveWithdrawRequest',
      'loadAccountBalanceList',
      'loadUserAccountList',
      'createUserAccount',
      'updateUserAccount',
    ]);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', [
      'info',
      'error',
    ]);

    TestBed.configureTestingModule({
      providers: [
        AccountEffects,
        provideMockActions(() => actions$),
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
      ],
    });

    effects = TestBed.inject(AccountEffects);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    toastrService = TestBed.inject(
      ToastrService,
    ) as jasmine.SpyObj<ToastrService>;
  });

  describe('saveDeposit$', () => {
    it('should return saveDepositSuccess on successful deposit', () => {
      const depositRequest = {} as UserAccountOperation;
      const action = saveDeposit({ depositRequest });
      const completion = saveDepositSuccess();

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', {});
      apiService.saveAccountDeposit.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveDeposit$).toBeObservable(expected);
      expect(toastrService.info).toHaveBeenCalledWith(
        'Deposit successfully sent',
      );
    });

    it('should return saveDepositFailure on error', () => {
      const depositRequest = {} as UserAccountOperation;
      const action = saveDeposit({ depositRequest });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = saveDepositFailure({ error: errorResponse });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.saveAccountDeposit.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveDeposit$).toBeObservable(expected);
      expect(toastrService.error).toHaveBeenCalledWith(
        'Error occurred while saving deposit request',
      );
    });
  });

  describe('saveWithdraw$', () => {
    it('should return saveWithdrawSuccess on successful withdrawal', () => {
      const withdrawRequest = {} as UserAccountOperation;
      const action = saveWithdraw({ withdrawRequest });
      const completion = saveWithdrawSuccess();

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', {});
      apiService.saveWithdrawRequest.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveWithdraw$).toBeObservable(expected);
      expect(toastrService.info).toHaveBeenCalledWith(
        'Withdraw request successfully sent',
      );
    });
    it('should return saveWithdrawFailure on error', () => {
      const withdrawRequest = {} as UserAccountOperation;
      const action = saveWithdraw({ withdrawRequest });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = saveWithdrawFailure({ error: errorResponse });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.saveWithdrawRequest.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveWithdraw$).toBeObservable(expected);
      expect(toastrService.error).toHaveBeenCalledWith(
        'Error occurred while sending withdraw request',
      );
    });
  });

  describe('listUserAccount$', () => {
    it('should return loadAccountBalanceListSuccess on successful load', () => {
      const userId = 'a';
      const action = loadAccountBalanceListAction({ userId });
      const accountBalanceList = [
        { currency: 'EUR', amount: 100 },
      ] as AccountBalance[];
      const completion = loadAccountBalanceListSuccess({ accountBalanceList });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', { b: accountBalanceList });
      apiService.loadAccountBalanceList.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.listUserAccount$).toBeObservable(expected);
    });

    it('should return loadAccountBalanceListFailure on error', () => {
      const userId = 'test-user-id';
      const action = loadAccountBalanceListAction({ userId });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = loadAccountBalanceListFailure({
        error: errorResponse,
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.loadAccountBalanceList.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.listUserAccount$).toBeObservable(expected);
    });
  });

  describe('saveAccount$', () => {
    it('should return saveUserAccountSuccess on successful account creation', () => {
      const userAccount: UserAccount = {
        id: undefined,
        userId: 'user',
        currency: 'CHF',
      }; // Example user account
      const action = saveUserAccount({ userAccount });
      const completion = saveUserAccountSuccess({
        userAccount: { id: '1', userId: 'user', currency: 'CHF' },
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', {
        b: { id: '1', userId: 'user', currency: 'CHF' },
      });
      apiService.createUserAccount.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveAccount$).toBeObservable(expected);
    });

    it('should return saveUserAccountSuccess on successful account update', () => {
      const userAccount: UserAccount = {
        id: '1',
        userId: 'user',
        currency: 'CHF',
      }; // Example user account
      const action = saveUserAccount({ userAccount });
      const completion = saveUserAccountSuccess({
        userAccount: { id: '1', userId: 'user', currency: 'CHF' },
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', {
        b: { id: '1', userId: 'user', currency: 'CHF' },
      });
      apiService.updateUserAccount.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveAccount$).toBeObservable(expected);
    });

    it('should return saveUserAccountFailure on error', () => {
      const userAccount: UserAccount = {
        id: undefined,
        userId: 'user',
        currency: 'CHF',
      }; // Example user account
      const action = saveUserAccount({ userAccount });
      const error = { message: 'Error creating account' } as HttpErrorResponse;
      const completion = saveUserAccountFailure({ error });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, error);
      apiService.createUserAccount.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveAccount$).toBeObservable(expected);
    });
    it('should return saveUserAccountFailure on error during account update', () => {
      const userAccount: UserAccount = {
        id: '1',
        userId: 'user',
        currency: 'CHF',
      }; // Example user account
      const action = saveUserAccount({ userAccount });
      const error = { message: 'Error updating account' } as HttpErrorResponse;
      const completion = saveUserAccountFailure({ error });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, error);
      apiService.updateUserAccount.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveAccount$).toBeObservable(expected);
    });
  });
});
