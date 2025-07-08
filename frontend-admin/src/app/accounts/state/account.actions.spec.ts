import {loadAccountListAction} from './account.actions';
import {UserAccountRequest} from '../../api/model/userAccountRequest';

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
});
