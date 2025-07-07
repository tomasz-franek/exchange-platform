import {loadAccountListAction} from './account.actions';
import {UserAccountRequest} from '../../api/model/userAccountRequest';

describe('Account Actions', () => {
  describe('saveDeposit', () => {
    it('should create an action to save a deposit', () => {
      const userAccountRequest: UserAccountRequest = {
        userId: ''
      };
      const action = loadAccountListAction({userAccountRequest});
      expect(action.type).toBe('[Account] Load user account list',);
      expect(action.userAccountRequest).toEqual(userAccountRequest);
    });
  });
});
