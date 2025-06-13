import { HttpErrorResponse } from '@angular/common/http';
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
import { UserAccount } from '../../api/model/userAccount';
import { UserAccountOperation } from '../../api/model/userAccountOperation';
import { AccountBalance } from '../../api/model/accountBalance';

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
});
