import { accountReducers, initialAccountState } from './account.reducers';
import { UserAccount } from '../../api/model/userAccount';
import {
  loadAccountListSuccess,
  loadAccountOperationListSuccess,
  loadSystemAccountListSuccess,
  loadUserListActionSuccess,
} from './account.actions';
import { UserData } from '../../api/model/userData';
import { AccountOperation } from '../../api/model/accountOperation';

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

  it('should handle loadAccountListSuccess', () => {
    const accountOperations: AccountOperation[] = [
      {
        amount: 300,
        dateUtc: '2025-01-01',
        currency: 'EUR',
      },
      {
        amount: 2500,
        dateUtc: '2025-02-01',
        currency: 'EUR',
      },
    ];
    const action = loadAccountOperationListSuccess({
      accountOperations,
    });
    const state = accountReducers(initialAccountState, action);

    expect(state.accountOperations).toEqual(accountOperations);
  });
});
