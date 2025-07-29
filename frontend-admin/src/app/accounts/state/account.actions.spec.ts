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
import {UserAccountRequest} from '../../api/model/userAccountRequest';
import {UserAccount} from "../../api/model/userAccount";
import {HttpErrorResponse} from '@angular/common/http';
import {
  UserAccountOperation
} from "../../../../../frontend-client/src/app/api/model/userAccountOperation";

describe('Account Actions', () => {
  describe('loadAccountListAction', () => {
    it('should create an action to load account list action', () => {
      const userAccountRequest: UserAccountRequest = {
        userId: ''
      };
      const action = loadAccountListAction({userAccountRequest});
      expect(action.type).toBe('[Account] Load user account list',);
      expect(action.userAccountRequest).toEqual(userAccountRequest);
    });
  });

  describe('loadAccountListSuccess', () => {
    it('should create an action for successful loading of user accounts', () => {
      const userAccounts: UserAccount[] = [{id: '1', currency: 'EUR', version: 2}, {
        id: '2',
        currency: 'GBP',
        version: 3
      },];
      const action = loadAccountListSuccess({userAccounts});

      expect(action.type).toBe('[Account] Load user account list success');
      expect(action.userAccounts).toEqual(userAccounts);
    });
  });

  describe('loadAccountListFailure', () => {
    it('should create an action for failed loading of user accounts', () => {
      const errorResponse = new HttpErrorResponse({error: 'Error message', status: 404});
      const action = loadAccountListFailure({error: errorResponse});

      expect(action.type).toBe('[Account] Load user account list failure');
      expect(action.error).toEqual(errorResponse);
    });
  });

  describe('saveDeposit', () => {
    it('should create an action to save a account-deposit', () => {
      const depositRequest: UserAccountOperation = {
        userId: '',
        userAccountId: '',
        amount: 0,
      };
      const action = saveDeposit({depositRequest});
      expect(action.type).toBe('[Account] SaveDeposit');
      expect(action.depositRequest).toEqual(depositRequest);
    });
  });

  describe('saveDepositSuccess', () => {
    it('should create an action for successful account-deposit', () => {
      const action = saveDepositSuccess();
      expect(action.type).toBe('[Account] SaveDepositSuccess');
    });
  });

  describe('saveDepositFailure', () => {
    it('should create an action for account-deposit failure', () => {
      const error: HttpErrorResponse = {} as HttpErrorResponse;
      const action = saveDepositFailure({error});
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
      const action = saveWithdraw({withdrawRequest});
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
      const action = saveWithdrawFailure({error});
      expect(action.type).toBe('[Account] SaveWithdrawFailure');
      expect(action.error).toEqual(error);
    });
  });
});
