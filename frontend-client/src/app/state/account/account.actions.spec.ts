import { HttpErrorResponse } from '@angular/common/http';
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
import { UserAccount } from '../../api/model/userAccount';
import { UserAccountOperation } from '../../api/model/userAccountOperation';
import { AccountBalance } from '../../api/model/accountBalance';
import { AccountOperationsRequest } from '../../api/model/accountOperationsRequest';
import { UserProperty } from '../../api/model/userProperty';
import { UserOperation } from '../../api/model/userOperation';

describe('Account Actions', () => {
  describe('saveDeposit', () => {
    it('should create an action to save a deposit', () => {
      const depositRequest: UserAccountOperation = {
        userId: '',
        userAccountId: '',
        amount: 0,
      };
      const action = saveDeposit({ depositRequest });
      expect(action.type).toBe('[Account] SaveDeposit');
      expect(action.depositRequest).toEqual(depositRequest);
    });
  });

  describe('saveDepositSuccess', () => {
    it('should create an action for successful deposit', () => {
      const action = saveDepositSuccess();
      expect(action.type).toBe('[Account] SaveDepositSuccess');
    });
  });

  describe('saveDepositFailure', () => {
    it('should create an action for deposit failure', () => {
      const error: HttpErrorResponse = {} as HttpErrorResponse;
      const action = saveDepositFailure({ error });
      expect(action.type).toBe('[Account] SaveDepositFailure');
      expect(action.error).toEqual(error);
    });
  });

  describe('saveWithdraw', () => {
    it('should create an action to save a withdrawal', () => {
      const withdrawRequest: UserAccountOperation = {
        userId: '',
        amount: 0,
        userAccountId: '',
      };
      const action = saveWithdraw({ withdrawRequest });
      expect(action.type).toBe('[Account] SaveDepositWithdraw');
      expect(action.withdrawRequest).toEqual(withdrawRequest);
    });
  });

  describe('saveWithdrawSuccess', () => {
    it('should create an action for successful withdrawal', () => {
      const action = saveWithdrawSuccess();
      expect(action.type).toBe('[Account] SaveWithdrawSuccess');
    });
  });

  describe('saveWithdrawFailure', () => {
    it('should create an action for withdrawal failure', () => {
      const error: HttpErrorResponse = {} as HttpErrorResponse;
      const action = saveWithdrawFailure({ error });
      expect(action.type).toBe('[Account] SaveWithdrawFailure');
      expect(action.error).toEqual(error);
    });
  });

  describe('loadAccountBalanceListAction', () => {
    it('should create an action to load user account list', () => {
      const action = loadAccountBalanceListAction();
      expect(action.type).toBe('[Account] LoadAccountBalanceList Action');
    });
  });

  describe('loadAccountBalanceListSuccess', () => {
    it('should create an action for successful user account list load', () => {
      const accountBalanceList: AccountBalance[] = [
        { currency: 'EUR', amount: 1 },
      ];
      const action = loadAccountBalanceListSuccess({ accountBalanceList });
      expect(action.type).toBe('[Account] LoadAccountBalanceListSuccess');
      expect(action.accountBalanceList).toEqual(accountBalanceList);
    });
  });

  describe('loadAccountBalanceListFailure', () => {
    it('should create an action for user account list load failure', () => {
      const error: HttpErrorResponse = {} as HttpErrorResponse;
      const action = loadAccountBalanceListFailure({ error });
      expect(action.type).toBe('[Account] LoadAccountBalanceListFailure');
      expect(action.error).toEqual(error);
    });
  });

  describe('saveUserAccount', () => {
    it('should create an action to save a user account', () => {
      const userAccount: UserAccount = {
        currency: 'EUR',
        version: 0,
      };
      const action = saveUserAccount({ userAccount });
      expect(action.type).toBe('[Account] SaveUserAccount');
      expect(action.userAccount).toEqual(userAccount);
    });
  });

  describe('saveUserAccountSuccess', () => {
    it('should create an action for successful user account save', () => {
      const userAccount: UserAccount = {
        currency: 'EUR',
        version: 0,
      };
      const action = saveUserAccountSuccess({ userAccount });
      expect(action.type).toBe('[Account] SaveUserAccountSuccess');
      expect(action.userAccount).toEqual(userAccount);
    });
  });

  describe('saveUserAccountFailure', () => {
    it('should create an action for user account save failure', () => {
      const error: HttpErrorResponse = {} as HttpErrorResponse;
      const action = saveUserAccountFailure({ error });
      expect(action.type).toBe('[Account] SaveUserAccountFailure');
      expect(action.error).toEqual(error);
    });
  });

  it('should create LoadUserOperationListAction', () => {
    const accountOperationsRequest: AccountOperationsRequest = {
      userId: '1',
      page: 2,
      dateFrom: 'a',
      dateTo: 'b',
      currency: 'CHF',
      size: 2,
    };
    const action = loadUserOperationListAction({ accountOperationsRequest });
    expect(action.type).toBe('[Account] LoadUserOperationListAction');
    expect(action.accountOperationsRequest).toEqual(accountOperationsRequest);
  });

  it('should create LoadUserOperationListSuccess', () => {
    const userOperationList: UserOperation[] = [
      {
        userId: '1',
        amount: 12,
        currency: 'CHF',
        dateUtc: 'a',
        eventType: 'DEPOSIT',
      },
    ];
    const action = loadUserOperationListSuccess({ userOperationList });
    expect(action.type).toBe('[Account] LoadUserOperationListSuccess');
    expect(action.userOperationList).toEqual(userOperationList);
  });

  it('should create LoadUserOperationListFailure', () => {
    const error = new HttpErrorResponse({
      error: 'Error message',
      status: 404,
    });
    const action = loadUserOperationListFailure({ error });
    expect(action.type).toBe('[Account] LoadUserOperationListFailure');
    expect(action.error).toEqual(error);
  });

  it('should create GetUserPropertyAction', () => {
    const action = getUserPropertyAction();
    expect(action.type).toBe('[Account] GetUserProperty');
  });

  it('should create GetUserPropertySuccess', () => {
    const userProperty: UserProperty = {
      userId: '1',
      version: 2,
      language: 'en',
      timezone: 'UTC',
    };
    const action = getUserPropertySuccess({ userProperty });
    expect(action.type).toBe('[Account] GetUserPropertySuccess');
    expect(action.userProperty).toEqual(userProperty);
  });

  it('should create GetUserPropertyFailure', () => {
    const error = new HttpErrorResponse({
      error: 'Error message',
      status: 500,
    });
    const action = getUserPropertyFailure({ error });
    expect(action.type).toBe('[Account] GetUserPropertyFailure');
    expect(action.error).toEqual(error);
  });

  it('should create SaveUserPropertyAction', () => {
    const userProperty: UserProperty = {
      userId: '1',
      version: 2,
      language: 'en',
      timezone: 'UTC',
    };
    const action = saveUserPropertyAction({ userProperty });
    expect(action.type).toBe('[Account] SaveUserPropertyAction');
    expect(action.userProperty).toEqual(userProperty);
  });

  it('should create SaveUserPropertySuccess', () => {
    const action = saveUserPropertySuccess();
    expect(action.type).toBe('[Account] SaveUserPropertySuccess');
  });

  it('should create SaveUserPropertyFailure', () => {
    const error = new HttpErrorResponse({
      error: 'Error message',
      status: 400,
    });
    const action = saveUserPropertyFailure({ error });
    expect(action.type).toBe('[Account] SaveUserPropertyFailure');
    expect(action.error).toEqual(error);
  });
});
