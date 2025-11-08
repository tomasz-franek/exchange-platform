import {
  AccountState,
  selectAccountAmountResponse,
  selectAccountOperationList,
  selectSystemAccountList,
  selectUserAccountsList,
  selectUserBankAccountList,
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
    accountOperations: [
      {
        amount: 100,
        dateUtc: '2025-01-01',
        currency: 'EUR',
      },
      {
        amount: 200,
        dateUtc: '2025-02-01',
        currency: 'EUR',
      },
    ],
    accountAmountResponse: { amount: 100 },
    userBankAccounts: [
      {
        userAccountId: 'userAccountId',
        version: 1,
        verifiedDateUtc: 'verifiedDateUtc',
        accountNumber: 'accountNumber',
        id: 'id',
        countryCode: 'CC',
        createdDateUtc: 'createdDateUtc',
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

  it('should select the account operations list', () => {
    const result = selectAccountOperationList.projector(mockState);
    expect(result).toEqual(mockState.accountOperations);
  });
  it('should select the account amount value', () => {
    const result = selectAccountAmountResponse.projector(mockState);
    expect(result).toEqual(mockState.accountAmountResponse);
  });
  it('should select the user bank account list', () => {
    const result = selectUserBankAccountList.projector(mockState);
    expect(result).toEqual(mockState.userBankAccounts);
  });
});
