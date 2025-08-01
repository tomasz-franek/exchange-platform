import {
  AccountState,
  selectAccountBalanceList,
  selectUserAccount,
  selectUserId,
  selectUserOperationList
} from './account.selectors';

describe('Account Selectors', () => {
  const mockState: AccountState = {
    accountBalanceList: [
      { amount: 100, currency: 'USD' },
      { amount: 200, currency: 'EUR' }
    ],
    userOperationList: [
      { amount: 100, currency: 'USD' },
      { amount: 200, currency: 'EUR' }
    ],

    userAccount: { id: '1', currency: 'USD', version: 0 },
    userId: 'user123'
  };

  it('should select the account balance list', () => {
    const result = selectAccountBalanceList.projector(mockState);
    expect(result).toEqual(mockState.accountBalanceList);
  });

  it('should select the user ID', () => {
    const result = selectUserId.projector(mockState);
    expect(result).toEqual(mockState.userId);
  });

  it('should select the user operation list', () => {
    const result = selectUserOperationList.projector(mockState);
    expect(result).toEqual(mockState.userOperationList);
  });


  it('should select the user account', () => {
    const result = selectUserAccount.projector(mockState);
    expect(result).toEqual(mockState.userAccount);
  });
});
