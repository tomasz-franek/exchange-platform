import { accountReducers, initialAccountState } from './account.reducers';
import { UserAccount } from '../../api/model/userAccount';
import {
  loadAccountListSuccess,
  loadSystemAccountListSuccess,
  loadUserListActionSuccess,
} from './account.actions';
import { UserData } from '../../api/model/userData';

describe('accountReducers', () => {
  it('should return the initial state', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = accountReducers(undefined, action);
    expect(state).toBe(initialAccountState);
  });

  it('should handle loadAccountListSuccess', () => {
    const userAccounts: UserAccount[] = [
      {
        currency: 'CHF',
        version: 2,
        id: 'id',
      },
    ];
    const action = loadAccountListSuccess({ userAccounts });
    const state = accountReducers(initialAccountState, action);

    expect(state.userAccounts).toEqual(userAccounts);
  });

  it('should handle loadAccountListSuccess', () => {
    const users: UserData[] = [
      { email: 'email1', userId: 'userId1', name: 'name1' },
      { email: 'email2', userId: 'userId2', name: 'name2' },
    ];
    const action = loadUserListActionSuccess({ users });
    const state = accountReducers(initialAccountState, action);

    expect(state.users).toEqual(users);
  });

  it('should handle loadSystemAccountListSuccess', () => {
    const systemAccounts: UserAccount[] = [
      {
        currency: 'CHF',
        version: 2,
        id: 'id',
      },
    ];
    const action = loadSystemAccountListSuccess({ systemAccounts });
    const state = accountReducers(initialAccountState, action);

    expect(state.systemAccounts).toEqual(systemAccounts);
  });
});
