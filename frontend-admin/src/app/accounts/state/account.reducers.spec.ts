import {accountReducers, initialAccountState} from './account.reducers';
import {UserAccount} from "../../api/model/userAccount";
import {loadAccountListSuccess} from "./account.actions";

describe('accountReducers', () => {
  it('should return the initial state', () => {
    const action = {type: 'UNKNOWN_ACTION'}; // An action that does not affect the state
    const state = accountReducers(undefined, action);
    expect(state).toBe(initialAccountState);
  });

  it('should handle loadAccountListSuccess', () => {
    const userAccounts: UserAccount[] = [{
      currency: "CHF",
      version: 2,
      id: 'id'
    }];
    const action = loadAccountListSuccess({userAccounts});
    const state = accountReducers(initialAccountState, action);

    expect(state.userAccounts).toEqual(userAccounts);
  });
});
