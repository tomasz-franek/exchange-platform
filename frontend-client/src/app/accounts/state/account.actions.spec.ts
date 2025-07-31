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
  saveUserAccount,
  saveUserAccountFailure,
  saveUserAccountSuccess,
  saveUserPropertyAction,
  saveUserPropertyFailure,
  saveUserPropertySuccess,
} from './account.actions';
import { UserAccount } from '../../api/model/userAccount';
import { AccountBalance } from '../../api/model/accountBalance';
import { AccountOperationsRequest } from '../../api/model/accountOperationsRequest';
import { UserProperty } from '../../api/model/userProperty';
import { UserOperation } from '../../api/model/userOperation';

describe('Account Actions', () => {
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
      const errorResponse: HttpErrorResponse = {} as HttpErrorResponse;
      const action = loadAccountBalanceListFailure({ errorResponse });
      expect(action.type).toBe('[Account] LoadAccountBalanceListFailure');
      expect(action.errorResponse).toEqual(errorResponse);
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
      const errorResponse: HttpErrorResponse = {} as HttpErrorResponse;
      const action = saveUserAccountFailure({ errorResponse });
      expect(action.type).toBe('[Account] SaveUserAccountFailure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  it('should create LoadUserOperationListAction', () => {
    const accountOperationsRequest: AccountOperationsRequest = {
      currency: 'GBP',
      dateFrom: 'test',
      dateTo: 'test2',
      page: 1,
      size: 10,
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
    const errorResponse = new HttpErrorResponse({
      error: 'Error message',
      status: 404,
    });
    const action = loadUserOperationListFailure({ errorResponse });
    expect(action.type).toBe('[Account] LoadUserOperationListFailure');
    expect(action.errorResponse).toEqual(errorResponse);
  });

  it('should create GetUserPropertyAction', () => {
    const action = getUserPropertyAction();
    expect(action.type).toBe('[Account] GetUserProperty Action');
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
    const errorResponse = new HttpErrorResponse({
      error: 'Error message',
      status: 500,
    });
    const action = getUserPropertyFailure({ errorResponse });
    expect(action.type).toBe('[Account] GetUserPropertyFailure');
    expect(action.errorResponse).toEqual(errorResponse);
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
    const errorResponse = new HttpErrorResponse({
      error: 'Error message',
      status: 400,
    });
    const action = saveUserPropertyFailure({ errorResponse });
    expect(action.type).toBe('[Account] SaveUserPropertyFailure');
    expect(action.errorResponse).toEqual(errorResponse);
  });
});
