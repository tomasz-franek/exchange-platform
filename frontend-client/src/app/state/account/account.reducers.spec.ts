import { accountReducers, initialAccountState } from './account.reducers';
import {
  getUserPropertySuccess,
  loadAccountBalanceListSuccess,
  loadUserOperationListSuccess,
  saveUserAccountSuccess,
} from './account.actions';
import { AccountState } from './account.selectors';

describe('accountReducers', () => {
  it('should return the initial state when no action is passed', () => {
    const newState = accountReducers(undefined, {
      type: '',
    });
    expect(newState).toEqual(initialAccountState);
  });

  it('should handle loadAccountBalanceListSuccess action', () => {
    const action = loadAccountBalanceListSuccess({
      accountBalanceList: [
        { currency: 'EUR', amount: 100 },
        { currency: 'PLN', amount: 200 },
        { currency: 'GBP', amount: 300 },
      ],
    });
    const expectedState = {
      ...initialAccountState,
      accountBalanceList: [
        { currency: 'EUR', amount: 100 },
        { currency: 'PLN', amount: 200 },
        { currency: 'GBP', amount: 300 },
      ],
    } as AccountState;
    const newState = accountReducers(initialAccountState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle saveUserAccountSuccess action', () => {
    const action = saveUserAccountSuccess({
      userAccount: { id: '1', currency: 'CHF', version: 0 },
    });
    const expectedState = {
      ...initialAccountState,
      userAccount: { id: '1', currency: 'CHF', version: 0 },
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
          eventType: 'EXCHANGE',
        },
      ],
    });
    const expectedState = {
      ...initialAccountState,
      userOperationList: [
        {
          currency: 'EUR',
          amount: 100,
          userId: '2',
          dateUtc: 'b',
          eventType: 'EXCHANGE',
        },
      ],
    } as AccountState;
    const newState = accountReducers(initialAccountState, action);
    expect(newState).toEqual(expectedState);
  });
  it('should handle getUserPropertySuccess action', () => {
    const action = getUserPropertySuccess({
      userProperty: { userId: '2', version: 3, language: 'a', timezone: 'b' },
    });
    const expectedState = {
      ...initialAccountState,
      userProperty: { userId: '2', version: 3, language: 'a', timezone: 'b' },
    } as AccountState;
    const newState = accountReducers(initialAccountState, action);
    expect(newState).toEqual(expectedState);
  });
});
