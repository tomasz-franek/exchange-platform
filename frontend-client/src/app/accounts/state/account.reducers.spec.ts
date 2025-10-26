import { accountReducers, initialAccountState } from './account.reducers';
import {
  loadAccountBalanceListSuccess,
  loadBankAccountListSuccess,
  loadUserOperationListSuccess,
  saveUserAccountSuccess,
  saveUserBankAccountSuccess
} from './account.actions';
import { AccountState } from './account.selectors';
import { UserBankAccount } from '../../api/model/userBankAccount';

describe('accountReducers', () => {
  it('should return the initial state when no action is passed', () => {
    const newState = accountReducers(undefined, {
      type: ''
    });
    expect(newState).toEqual(initialAccountState);
  });

  it('should handle loadAccountBalanceListSuccess action', () => {
    const action = loadAccountBalanceListSuccess({
      accountBalanceList: [
        { currency: 'EUR', amount: 100 },
        { currency: 'PLN', amount: 200 },
        { currency: 'GBP', amount: 300 }
      ]
    });
    const expectedState = {
      ...initialAccountState,
      accountBalanceList: [
        { currency: 'EUR', amount: 100 },
        { currency: 'PLN', amount: 200 },
        { currency: 'GBP', amount: 300 }
      ]
    } as AccountState;
    const newState = accountReducers(initialAccountState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle saveUserAccountSuccess action', () => {
    const action = saveUserAccountSuccess({
      userAccount: { id: '1', currency: 'CHF', version: 0 }
    });
    const expectedState = {
      ...initialAccountState,
      userAccount: { id: '1', currency: 'CHF', version: 0 }
    } as AccountState;
    const newState = accountReducers(initialAccountState, action);
    expect(newState).toEqual(expectedState);
  });
  it('should handle loadUserOperationListSuccess action', () => {
    const action = loadUserOperationListSuccess({
      userOperationList: [
        {
          currency: 'EUR',
          amount: 100,
          userId: '2',
          dateUtc: 'b',
          eventType: 'ORDER'
        }
      ]
    });
    const expectedState = {
      ...initialAccountState,
      userOperationList: [
        {
          currency: 'EUR',
          amount: 100,
          userId: '2',
          dateUtc: 'b',
          eventType: 'ORDER'
        }
      ]
    } as AccountState;
    const newState = accountReducers(initialAccountState, action);
    expect(newState).toEqual(expectedState);
  });
  it('should handle saveUserBankAccountSuccess action', () => {
    const action = saveUserBankAccountSuccess({
      userBankAccount: {
        id: 'id',
        userAccountId: 'userAccountId',
        version: 2,
        accountNumber: 'accountNumber',
        countryCode: 'cc',
        createdDateUtc: 'createdDateUtc',
        verifiedDateUtc: 'verifiedDateUtc'

      }
    });
    const expectedState = {
      ...initialAccountState,
      userBankAccount: {
        id: 'id',
        userAccountId: 'userAccountId',
        version: 2,
        accountNumber: 'accountNumber',
        countryCode: 'cc',
        createdDateUtc: 'createdDateUtc',
        verifiedDateUtc: 'verifiedDateUtc'

      }
    } as AccountState;
    const newState = accountReducers(initialAccountState, action);
    expect(newState).toEqual(expectedState);
  });
  it('should handle loadBankAccountListSuccess', () => {
    const userBankAccounts: UserBankAccount[] = [
      {
        userAccountId: 'userAccountId',
        version: 1,
        verifiedDateUtc: 'verifiedDateUtc',
        accountNumber: 'accountNumber',
        id: 'id',
        countryCode: 'CC',
        createdDateUtc: 'createdDateUtc'
      }
    ] as UserBankAccount[];
    const action = loadBankAccountListSuccess({ userBankAccounts });
    const state = accountReducers(initialAccountState, action);

    expect(state.userBankAccounts).toEqual(userBankAccounts);
  });
});
