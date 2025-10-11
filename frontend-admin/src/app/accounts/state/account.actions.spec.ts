import {
  loadAccountAmountAction,
  loadAccountAmountFailure,
  loadAccountAmountSuccess,
  loadAccountListAction,
  loadAccountListFailure,
  loadAccountListSuccess,
  loadAccountOperationListAction,
  loadAccountOperationListFailure,
  loadAccountOperationListSuccess,
  loadOperationPdfDocumentAction,
  loadOperationPdfDocumentFailure,
  loadOperationPdfDocumentSuccess,
  loadSystemAccountListAction,
  loadSystemAccountListFailure,
  loadSystemAccountListSuccess,
  loadUserListAction,
  loadUserListActionFailure,
  loadUserListActionSuccess,
  saveDeposit,
  saveDepositFailure,
  saveDepositSuccess,
  saveWithdraw,
  saveWithdrawFailure,
  saveWithdrawSuccess,
} from './account.actions';
import { UserAccountRequest } from '../../api/model/userAccountRequest';
import { UserAccount } from '../../api/model/userAccount';
import { HttpErrorResponse } from '@angular/common/http';
import { UserAccountOperation } from '../../api/model/userAccountOperation';
import { LoadUserRequest } from '../../api/model/loadUserRequest';
import { UserData } from '../../api/model/userData';
import { AccountOperationsRequest } from '../../api/model/accountOperationsRequest';
import { AccountOperation } from '../../api/model/accountOperation';
import { AccountAmountRequest } from '../../api/model/accountAmountRequest';
import { AccountAmountResponse } from '../../api/model/accountAmountResponse';

describe('Account Actions', () => {
  describe('loadAccountListAction', () => {
    it('should create an action to load account list action', () => {
      const userAccountRequest: UserAccountRequest = {
        userId: '',
      };
      const action = loadAccountListAction({ userAccountRequest });
      expect(action.type).toBe('[Account] Load user account list');
      expect(action.userAccountRequest).toEqual(userAccountRequest);
    });
  });

  describe('loadAccountListSuccess', () => {
    it('should create an action for successful loading of user accounts', () => {
      const userAccounts: UserAccount[] = [
        { id: '1', currency: 'EUR', version: 2 },
        {
          id: '2',
          currency: 'GBP',
          version: 3,
        },
      ];
      const action = loadAccountListSuccess({ userAccounts });

      expect(action.type).toBe('[Account] Load user account list success');
      expect(action.userAccounts).toEqual(userAccounts);
    });
  });

  describe('loadAccountListFailure', () => {
    it('should create an action for failed loading of user accounts', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Error message',
        status: 404,
      });
      const action = loadAccountListFailure({ errorResponse });

      expect(action.type).toBe('[Account] Load user account list failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('saveDeposit', () => {
    it('should create an action to save a account-deposit', () => {
      const depositRequest: UserAccountOperation = {
        userId: '',
        userAccountId: '',
        amount: 0,
        currency: 'EUR',
      };
      const action = saveDeposit({ depositRequest });
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
      const errorResponse: HttpErrorResponse = {} as HttpErrorResponse;
      const action = saveDepositFailure({ errorResponse });
      expect(action.type).toBe('[Account] SaveDepositFailure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('saveWithdraw', () => {
    it('should create an action to save a withdrawal', () => {
      const withdrawRequest: UserAccountOperation = {
        userId: '',
        amount: 0,
        userAccountId: '',
        currency: 'EUR',
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
      const errorResponse: HttpErrorResponse = {} as HttpErrorResponse;
      const action = saveWithdrawFailure({ errorResponse });
      expect(action.type).toBe('[Account] SaveWithdrawFailure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('loadUserListAction', () => {
    it('should create an action to load user list action', () => {
      const loadUserRequest: LoadUserRequest = {
        email: undefined,
      };
      const action = loadUserListAction({ loadUserRequest });
      expect(action.type).toBe('[Account] Load User List');
      expect(action.loadUserRequest).toEqual(loadUserRequest);
    });
  });

  describe('loadUserListActionSuccess', () => {
    it('should create an action for successful loading of users', () => {
      const users: UserData[] = [
        { email: 'email1', userId: 'userId1', name: 'name1' },
        { email: 'email2', userId: 'userId2', name: 'name2' },
      ];
      const action = loadUserListActionSuccess({ users });

      expect(action.type).toBe('[Account] Load User List Success');
      expect(action.users).toEqual(users);
    });
  });

  describe('loadUserListActionFailure', () => {
    it('should create an action for failed loading of users', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Error message',
        status: 404,
      });
      const action = loadUserListActionFailure({ errorResponse });

      expect(action.type).toBe('[Account] Load User List Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('loadSystemAccountListAction', () => {
    [{ accountType: 'system' }, { accountType: 'exchange' }].forEach(
      ({ accountType }) => {
        it(`should create an action to load system account list action for ${accountType}`, () => {
          const action = loadSystemAccountListAction({ accountType });
          expect(action.type).toBe('[Account] Load System Account List');
        });
      },
    );
  });

  describe('loadSystemAccountListSuccess', () => {
    it('should create an action for successful loading of system accounts', () => {
      const systemAccounts: UserAccount[] = [
        { id: '1', currency: 'EUR', version: 2 },
        {
          id: '2',
          currency: 'GBP',
          version: 3,
        },
      ];
      const action = loadSystemAccountListSuccess({ systemAccounts });

      expect(action.type).toBe('[Account] Load System Account List Success');
      expect(action.systemAccounts).toEqual(systemAccounts);
    });
  });

  describe('loadSystemAccountListFailure', () => {
    it('should create an action for failed loading of system accounts', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Error message',
        status: 404,
      });
      const action = loadSystemAccountListFailure({ errorResponse });

      expect(action.type).toBe('[Account] Load System Account List Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('loadAccountOperationListAction', () => {
    it('should create an action to load account operation list action', () => {
      const loadAccountOperationsRequest: AccountOperationsRequest = {
        dateFromUtc: '2025-01-01',
        dateToUtc: '2025-12-31',
        systemAccountId: 'x',
      };
      const action = loadAccountOperationListAction({
        loadAccountOperationsRequest,
      });
      expect(action.type).toBe('[Account] Load Account Operation List');
    });
  });

  describe('loadAccountOperationListSuccess', () => {
    it('should create an action for successful loading of account operations', () => {
      const accountOperations: AccountOperation[] = [
        {
          amount: 100,
          dateUtc: '2025-01-01',
          currency: 'EUR',
        },
        {
          amount: 200,
          dateUtc: '2025-02-01',
          currency: 'EUR',
        },
      ];
      const action = loadAccountOperationListSuccess({
        accountOperations,
      });

      expect(action.type).toBe('[Account] Load Account Operation List Success');
      expect(action.accountOperations).toEqual(accountOperations);
    });
  });

  describe('loadAccountOperationListFailure', () => {
    it('should create an action for failed loading of account operations', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Error message',
        status: 404,
      });
      const action = loadAccountOperationListFailure({ errorResponse });

      expect(action.type).toBe('[Account] Load Account Operation List Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('loadOperationPdfDocumentAction', () => {
    it('should create an action for loading of account operations pdf document', () => {
      const loadAccountOperationsRequest = {
        systemAccountId: '1',
        dateToUtc: '2025-01-01',
        dateFromUtc: '2025-01-01',
      } as AccountOperationsRequest;
      const action = loadOperationPdfDocumentAction({
        loadAccountOperationsRequest,
      });

      expect(action.type).toBe('[Account] Load Operation PDF Document');
      expect(action.loadAccountOperationsRequest).toEqual(
        loadAccountOperationsRequest,
      );
    });
  });

  describe('loadOperationPdfDocumentSuccess', () => {
    it('should create an action for success loading of account operations pdf document', () => {
      const action = loadOperationPdfDocumentSuccess();

      expect(action.type).toBe('[Account] Load Operation PDF Document Success');
    });
  });
  describe('loadOperationPdfDocumentFailure', () => {
    it('should create an action for failed loading of account operations pdf document', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Error message',
        status: 404,
      });
      const action = loadOperationPdfDocumentFailure({ errorResponse });

      expect(action.type).toBe(
        '[Account] Load  Operation PDF Document Failure',
      );
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('loadAccountAmountAction', () => {
    it('should create an action for loading of account amount value', () => {
      const request = {
        accountId: '1',
      } as AccountAmountRequest;
      const action = loadAccountAmountAction({
        request,
      });

      expect(action.type).toBe('[Account] Load Account Amount');
      expect(action.request).toEqual(request);
    });
  });

  describe('loadAccountAmountSuccess', () => {
    it('should create an action for success loading of account amount value', () => {
      const accountAmountResponse: AccountAmountResponse = { amount: 29 };
      const action = loadAccountAmountSuccess({ accountAmountResponse });

      expect(action.type).toBe('[Account] Load Account Amount Success');
      expect(action.accountAmountResponse).toEqual(accountAmountResponse);
    });
  });
  describe('loadAccountAmountFailure', () => {
    it('should create an action for failed loading of account amount value', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Error message',
        status: 404,
      });
      const action = loadAccountAmountFailure({ errorResponse });

      expect(action.type).toBe('[Account] Load Account Amount Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });
});
