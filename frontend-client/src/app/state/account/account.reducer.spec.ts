import { accountReducer, initialAccountState } from './account.reducer';
import {
  loadAccountBalanceListSuccess,
  saveUserAccountSuccess,
} from './account.action';
import { AccountState } from './account.selector';

describe('accountReducer', () => {
  it('should return the initial state when no action is passed', () => {
    const newState = accountReducer(undefined, {
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
    const newState = accountReducer(initialAccountState, action);
    expect(newState).toEqual(expectedState);
  });

  it('should handle saveUserAccountSuccess action', () => {
    const action = saveUserAccountSuccess({
      userAccount: { id: '1', idUser: 'Test Account', currency: 'CHF' },
    });
    const expectedState = {
      ...initialAccountState,
      userAccount: { id: '1', idUser: 'Test Account', currency: 'CHF' },
    } as AccountState;
    const newState = accountReducer(initialAccountState, action);
    expect(newState).toEqual(expectedState);
  });
});
