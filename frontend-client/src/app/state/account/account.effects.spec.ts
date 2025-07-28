import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { AccountEffects } from './account.effects';
import { ApiService } from '../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { cold, hot } from 'jasmine-marbles';
import {
  getUserPropertyAction,
  getUserPropertyFailure,
  getUserPropertySuccess,
  loadAccountBalanceListAction,
  loadAccountBalanceListFailure,
  loadAccountBalanceListSuccess,
  loadUserOperationListAction,
  loadUserOperationListFailure,
  loadUserOperationListSuccess,
  saveDeposit,
  saveDepositFailure,
  saveDepositSuccess,
  saveUserAccount,
  saveUserAccountFailure,
  saveUserAccountSuccess,
  saveUserPropertyAction,
  saveUserPropertyFailure,
  saveUserPropertySuccess,
  saveWithdraw,
  saveWithdrawFailure,
  saveWithdrawSuccess,
} from './account.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { UserAccount } from '../../api/model/userAccount';
import { UserAccountOperation } from '../../api/model/userAccountOperation';
import { AccountBalance } from '../../api/model/accountBalance';
import { UserProperty } from '../../api/model/userProperty';
import { AccountOperationsRequest } from '../../api/model/accountOperationsRequest';
import { UserOperation } from '../../api/model/userOperation';

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
      'getUserProperty',
      'saveUserProperty',
      'loadUserOperationList',
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
    it('should return saveDepositSuccess on successful account-deposit', () => {
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
        'Error occurred while saving account-deposit request',
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
      const action = loadAccountBalanceListAction();
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
      const action = loadAccountBalanceListAction();
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
        currency: 'CHF',
        version: 0,
      }; // Example user account
      const action = saveUserAccount({ userAccount });
      const completion = saveUserAccountSuccess({
        userAccount: {
          id: '1',
          currency: 'CHF',
          version: 0,
        },
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', {
        b: { id: '1', currency: 'CHF', version: 0 },
      });
      apiService.createUserAccount.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveAccount$).toBeObservable(expected);
      expect(toastrService.info).toHaveBeenCalledWith('Account saved');
    });

    it('should return saveUserAccountSuccess on successful account update', () => {
      const userAccount: UserAccount = {
        id: '1',
        currency: 'CHF',
        version: 0,
      }; // Example user account
      const action = saveUserAccount({ userAccount });
      const completion = saveUserAccountSuccess({
        userAccount: { id: '1', currency: 'CHF', version: 0 },
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', {
        b: { id: '1', currency: 'CHF', version: 0 },
      });
      apiService.updateUserAccount.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveAccount$).toBeObservable(expected);
      expect(toastrService.info).toHaveBeenCalledWith('Account saved');
    });

    it('should return saveUserAccountFailure on error', () => {
      const userAccount: UserAccount = {
        id: undefined,
        currency: 'CHF',
        version: 0,
      }; // Example user account
      const action = saveUserAccount({ userAccount });
      const error = { message: 'Error creating account' } as HttpErrorResponse;
      const completion = saveUserAccountFailure({ error });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, error);
      apiService.createUserAccount.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveAccount$).toBeObservable(expected);
      expect(toastrService.error).toHaveBeenCalledWith(
        'Error occurred while saving account',
      );
    });

    it('should return saveUserAccountFailure on error when account exists', () => {
      const userAccount: UserAccount = {
        id: undefined,
        currency: 'CHF',
        version: 0,
      }; // Example user account
      const action = saveUserAccount({ userAccount });
      const error = {
        message: 'Error creating account',
        status: 302,
      } as HttpErrorResponse;
      const completion = saveUserAccountFailure({ error });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, error);
      apiService.createUserAccount.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveAccount$).toBeObservable(expected);
      expect(toastrService.error).toHaveBeenCalledWith(
        'Account already exists',
      );
    });

    it('should return saveUserAccountFailure on error during account update', () => {
      const userAccount: UserAccount = {
        id: '1',
        currency: 'CHF',
        version: 0,
      }; // Example user account
      const action = saveUserAccount({ userAccount });
      const error = { message: 'Error updating account' } as HttpErrorResponse;
      const completion = saveUserAccountFailure({ error });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, error);
      apiService.updateUserAccount.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveAccount$).toBeObservable(expected);
      expect(toastrService.error).toHaveBeenCalledWith(
        'Error occurred while saving account',
      );
    });
  });

  describe('saveUserProperty$', () => {
    it('should return saveUserPropertySuccess on successful withdrawal', () => {
      const userProperty = {
        id: '1',
        currency: 'CHF',
        version: 0,
        language: 'en',
        timezone: 'UTC',
      } as UserProperty;
      const action = saveUserPropertyAction({ userProperty });
      const completion = saveUserPropertySuccess();

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', {});
      apiService.saveUserProperty.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveUserProperty$).toBeObservable(expected);
    });
    it('should return saveUserPropertyFailure on error', () => {
      const userProperty = {
        id: '1',
        currency: 'CHF',
        version: 0,
        language: 'en',
        timezone: 'UTC',
      } as UserProperty;
      const action = saveUserPropertyAction({ userProperty });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = saveUserPropertyFailure({ error: errorResponse });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.saveUserProperty.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveUserProperty$).toBeObservable(expected);
    });
  });

  describe('getUserProperty$', () => {
    it('should return getUserPropertySuccess on successful get properties', () => {
      const userProperty = {
        id: '1',
        currency: 'CHF',
        version: 0,
        language: 'en',
        timezone: 'UTC',
      } as UserProperty;
      const action = getUserPropertyAction();
      const completion = getUserPropertySuccess({ userProperty });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', {
        b: {
          id: '1',
          currency: 'CHF',
          version: 0,
          language: 'en',
          timezone: 'UTC',
        },
      });
      apiService.getUserProperty.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.getUserProperty$).toBeObservable(expected);
    });

    it('should return getUserPropertyFailure on error', () => {
      const action = getUserPropertyAction();
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = getUserPropertyFailure({ error: errorResponse });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.getUserProperty.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.getUserProperty$).toBeObservable(expected);
    });
  });

  describe('loadUserOperation$', () => {
    it('should return loadUserOperationListSuccess on successful get properties', () => {
      const accountOperationsRequest = {
        page: 1,
        currency: 'EUR',
        dateFrom: 'x',
        dateTo: 'y',
        size: 3,
      } as AccountOperationsRequest;
      const userOperationList: UserOperation[] = [
        {
          userId: 'id',
          currency: 'EUR',
          amount: 10,
          eventType: 'FEE',
          dateUtc: '10',
        },
      ];
      const action = loadUserOperationListAction({ accountOperationsRequest });
      const completion = loadUserOperationListSuccess({ userOperationList });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', {
        b: [
          {
            userId: 'id',
            currency: 'EUR',
            amount: 10,
            eventType: 'FEE',
            dateUtc: '10',
          },
        ],
      });
      apiService.loadUserOperationList.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadUserOperation$).toBeObservable(expected);
    });

    it('should return loadUserOperationListFailure on error', () => {
      const accountOperationsRequest = {
        page: 1,
        currency: 'EUR',
        dateFrom: 'x',
        dateTo: 'y',
        size: 3,
      } as AccountOperationsRequest;
      const action = loadUserOperationListAction({ accountOperationsRequest });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = loadUserOperationListFailure({ error: errorResponse });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.loadUserOperationList.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadUserOperation$).toBeObservable(expected);
    });
  });
});
