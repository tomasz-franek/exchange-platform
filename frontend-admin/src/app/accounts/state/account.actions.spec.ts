import {
  loadAccountListAction,
  loadAccountListFailure,
  loadAccountListSuccess
} from './account.actions';
import {UserAccountRequest} from '../../api/model/userAccountRequest';
import {UserAccount} from "../../api/model/userAccount";
import {HttpErrorResponse} from '@angular/common/http';

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
});
