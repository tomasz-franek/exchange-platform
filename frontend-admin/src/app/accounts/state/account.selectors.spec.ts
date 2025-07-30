import {AccountState, selectUserAccountsList, selectUserList} from './account.selectors';

describe('Account Selectors', () => {
  const mockState: AccountState = {
    userAccounts: [
      {id: '1', currency: 'USD', version: 1},
      {id: '2', currency: 'EUR', version: 1},
      {id: '3', currency: 'USD', version: 1},
    ],
    users: [
      {email: 'email1', userId: 'userId1', name: 'name1'},
      {email: 'email2', userId: 'userId2', name: 'name2'},
    ]
  };
  it('should select the user accounts list', () => {
    const result = selectUserAccountsList.projector(mockState);
    expect(result).toEqual(mockState.userAccounts);
  });

  it('should select the user list', () => {
    const result = selectUserList.projector(mockState);
    expect(result).toEqual(mockState.users);
  });
});
