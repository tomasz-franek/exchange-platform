import {
  AccountState,
  selectAccountBalanceList,
  selectUserAccount,
  selectUserBankAccount,
  selectUserBankAccountList,
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
    userId: 'user123',
    userBankAccount: {
      id: 'id',
      userAccountId: 'userAccountId',
      version: 2,
      accountNumber: 'accountNumber',
      countryCode: 'cc',
      createdDateUtc: 'createdDateUtc',
      verifiedDateUtc: 'verifiedDateUtc'
    },
    userBankAccounts: [
      {
        userAccountId: 'userAccountId',
        version: 1,
        verifiedDateUtc: 'verifiedDateUtc',
        accountNumber: 'accountNumber',
        id: 'id',
        countryCode: 'CC',
        createdDateUtc: 'createdDateUtc'
      },
      {
        userAccountId: 'userAccountId2',
        version: 1,
        verifiedDateUtc: 'verifiedDateUtc2',
        accountNumber: 'accountNumber2',
        id: 'id',
        countryCode: 'AA',
        createdDateUtc: 'createdDateUtc2'
      }
    ]
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

  it('should select the user bank account', () => {
    const result = selectUserBankAccount.projector(mockState);
    expect(result).toEqual(mockState.userBankAccount);
  });
  it('should select the user bank account list', () => {
    const result = selectUserBankAccountList.projector(mockState);
    expect(result).toEqual(mockState.userBankAccounts);
  });
});
