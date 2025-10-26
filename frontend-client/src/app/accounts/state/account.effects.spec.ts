import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { AccountEffects } from './account.effects';
import { ApiService } from '../../../services/api/api.service';
import { ToastrService } from 'ngx-toastr';
import { cold, hot } from 'jasmine-marbles';
import {
  loadAccountBalanceListAction,
  loadAccountBalanceListFailure,
  loadAccountBalanceListSuccess,
  loadUserOperationListAction,
  loadUserOperationListFailure,
  loadUserOperationListSuccess,
  saveUserAccount,
  saveUserAccountFailure,
  saveUserAccountSuccess,
  saveUserBankAccountAction,
  saveUserBankAccountFailure,
  saveUserBankAccountSuccess,
  saveWithdrawAction,
  saveWithdrawFailure,
  saveWithdrawSuccess
} from './account.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { UserAccount } from '../../api/model/userAccount';
import { AccountBalance } from '../../api/model/accountBalance';
import { AccountOperationsRequest } from '../../api/model/accountOperationsRequest';
import { UserOperation } from '../../api/model/userOperation';
import { UserAccountOperation } from '../../api/model/userAccountOperation';
import { UserBankAccount } from '../../api/model/userBankAccount';

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
      'loadUserOperationList',
      'saveBankAccount'
    ]);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', [
      'info',
      'error'
    ]);

    TestBed.configureTestingModule({
      providers: [
        AccountEffects,
        provideMockActions(() => actions$),
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy }
      ]
    });

    effects = TestBed.inject(AccountEffects);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    toastrService = TestBed.inject(
      ToastrService
    ) as jasmine.SpyObj<ToastrService>;
  });

  describe('listUserAccount$', () => {
    it('should return loadAccountBalanceListSuccess on successful load', () => {
      const action = loadAccountBalanceListAction();
      const accountBalanceList = [
        { currency: 'EUR', amount: 100 }
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
      const completion = loadAccountBalanceListFailure({ errorResponse });

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
        version: 0
      }; // Example user account
      const action = saveUserAccount({ userAccount });
      const completion = saveUserAccountSuccess({
        userAccount: {
          id: '1',
          currency: 'CHF',
          version: 0
        }
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', {
        b: { id: '1', currency: 'CHF', version: 0 }
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
        version: 0
      }; // Example user account
      const action = saveUserAccount({ userAccount });
      const completion = saveUserAccountSuccess({
        userAccount: { id: '1', currency: 'CHF', version: 0 }
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', {
        b: { id: '1', currency: 'CHF', version: 0 }
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
        version: 0
      }; // Example user account
      const action = saveUserAccount({ userAccount });
      const errorResponse = {
        message: 'Error creating account'
      } as HttpErrorResponse;
      const completion = saveUserAccountFailure({ errorResponse });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.createUserAccount.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveAccount$).toBeObservable(expected);
      expect(toastrService.error).toHaveBeenCalledWith(
        'Error occurred while saving account'
      );
    });

    it('should return saveUserAccountFailure on error when account exists', () => {
      const userAccount: UserAccount = {
        id: undefined,
        currency: 'CHF',
        version: 0
      }; // Example user account
      const action = saveUserAccount({ userAccount });
      const errorResponse = {
        message: 'Error creating account',
        status: 302
      } as HttpErrorResponse;
      const completion = saveUserAccountFailure({ errorResponse });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.createUserAccount.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveAccount$).toBeObservable(expected);
      expect(toastrService.error).toHaveBeenCalledWith(
        'Account already exists'
      );
    });

    it('should return saveUserAccountFailure on error during account update', () => {
      const userAccount: UserAccount = {
        id: '1',
        currency: 'CHF',
        version: 0
      }; // Example user account
      const action = saveUserAccount({ userAccount });
      const errorResponse = {
        message: 'Error updating account'
      } as HttpErrorResponse;
      const completion = saveUserAccountFailure({ errorResponse });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.updateUserAccount.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveAccount$).toBeObservable(expected);
      expect(toastrService.error).toHaveBeenCalledWith(
        'Error occurred while saving account'
      );
    });
  });

  describe('loadUserOperation$', () => {
    it('should return loadUserOperationListSuccess on successful get properties', () => {
      const accountOperationsRequest = {
        page: 1,
        currency: 'EUR',
        dateFrom: 'x',
        dateTo: 'y',
        size: 3
      } as AccountOperationsRequest;
      const userOperationList: UserOperation[] = [
        {
          userId: 'id',
          currency: 'EUR',
          amount: 10,
          eventType: 'FEE',
          dateUtc: '10'
        }
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
            dateUtc: '10'
          }
        ]
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
        size: 3
      } as AccountOperationsRequest;
      const action = loadUserOperationListAction({ accountOperationsRequest });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = loadUserOperationListFailure({ errorResponse });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.loadUserOperationList.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadUserOperation$).toBeObservable(expected);
    });
  });

  describe('saveWithdraw$', () => {
    it('should return saveWithdrawSuccess on successful get properties', () => {
      const withdrawRequest: UserAccountOperation = {
        currency: 'GBP',
        amount: 12,
        userId: '',
        userAccountId: ''
      };
      const action = saveWithdrawAction({ withdrawRequest });
      const completion = saveWithdrawSuccess();

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', {
        b: [
          {
            userId: 'id',
            currency: 'EUR',
            amount: 10,
            eventType: 'FEE',
            dateUtc: '10'
          }
        ]
      });
      apiService.saveWithdrawRequest.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveWithdraw$).toBeObservable(expected);
    });

    it('should return saveWithdrawFailure on error', () => {
      const withdrawRequest: UserAccountOperation = {
        currency: 'GBP',
        amount: 12,
        userId: '',
        userAccountId: ''
      };
      const action = saveWithdrawAction({ withdrawRequest });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = saveWithdrawFailure({ errorResponse });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.saveWithdrawRequest.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveWithdraw$).toBeObservable(expected);
    });
  });

  describe('saveUserBankAccount$', () => {
    it('should return saveWithdrawSuccess on successful get properties', () => {
      const userBankAccount: UserBankAccount = {
        id: 'id',
        userAccountId: 'userAccountId',
        version: 2,
        accountNumber: 'accountNumber',
        countryCode: 'cc',
        createdDateUtc: 'createdDateUtc',
        verifiedDateUtc: 'verifiedDateUtc'

      };
      const action = saveUserBankAccountAction({ userBankAccount });
      const completion = saveUserBankAccountSuccess({ userBankAccount });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', {
        b: {
          id: 'id',
          userAccountId: 'userAccountId',
          version: 2,
          accountNumber: 'accountNumber',
          countryCode: 'cc',
          createdDateUtc: 'createdDateUtc',
          verifiedDateUtc: 'verifiedDateUtc'
        }
      });
      apiService.saveBankAccount.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveUserBankAccount$).toBeObservable(expected);
    });

    it('should return saveWithdrawFailure on error', () => {
      const userBankAccount: UserBankAccount = {
        id: 'id',
        userAccountId: 'userAccountId',
        version: 2,
        accountNumber: 'accountNumber',
        countryCode: 'cc',
        createdDateUtc: 'createdDateUtc',
        verifiedDateUtc: 'verifiedDateUtc'

      };
      const action = saveUserBankAccountAction({ userBankAccount });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = saveUserBankAccountFailure({ errorResponse });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.saveBankAccount.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.saveUserBankAccount$).toBeObservable(expected);
    });
  });
});
