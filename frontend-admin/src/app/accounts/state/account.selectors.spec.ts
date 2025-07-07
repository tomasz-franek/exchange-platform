import {AccountState, selectUserAccountsList} from './account.selectors';

describe('Account Selectors', () => {
  const mockState: AccountState = {
    userAccounts: [
      {id: '1', currency: 'USD', version: 1},
      {id: '2', currency: 'EUR', version: 1},
      {id: '3', currency: 'USD', version: 1},
    ]
  };
  it('should select the account balance list', () => {
    const result = selectUserAccountsList.projector(mockState);
    expect(result).toEqual(mockState.userAccounts);
  });
});
