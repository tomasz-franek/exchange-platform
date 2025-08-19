import {
  AccountState,
  selectSystemAccountList,
  selectSystemAccountOperationList,
  selectUserAccountsList,
  selectUserList,
} from './account.selectors';

describe('Account Selectors', () => {
  const mockState: AccountState = {
    userAccounts: [
      { id: '1', currency: 'USD', version: 1 },
      { id: '2', currency: 'EUR', version: 1 },
      { id: '3', currency: 'USD', version: 1 },
    ],
    users: [
      { email: 'email1', userId: 'userId1', name: 'name1' },
      { email: 'email2', userId: 'userId2', name: 'name2' },
    ],
    systemAccounts: [
      { id: '4', currency: 'USD', version: 1 },
      { id: '5', currency: 'EUR', version: 1 },
      { id: '6', currency: 'USD', version: 1 },
    ],
    systemAccountOperations: [
      {
        amount: 100,
        dateUtc: '2025-01-01',
      },
      {
        amount: 200,
        dateUtc: '2025-02-01',
      },
    ],
  };
  it('should select the user accounts list', () => {
    const result = selectUserAccountsList.projector(mockState);
    expect(result).toEqual(mockState.userAccounts);
  });

  it('should select the user list', () => {
    const result = selectUserList.projector(mockState);
    expect(result).toEqual(mockState.users);
  });

  it('should select the system accounts list', () => {
    const result = selectSystemAccountList.projector(mockState);
    expect(result).toEqual(mockState.systemAccounts);
  });

  it('should select the system account operations list', () => {
    const result = selectSystemAccountOperationList.projector(mockState);
    expect(result).toEqual(mockState.systemAccountOperations);
  });
});
