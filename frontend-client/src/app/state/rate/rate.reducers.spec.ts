import { initialRateState, rateReducers } from './rate.reducers';
import { CurrencyRate } from '../../api';
import { loadCurrencyRateListActionSuccess } from './rate.actions';

describe('Rate Reducers', () => {
  it('should return the initial state when no action is passed', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = rateReducers(undefined, action);
    expect(state).toEqual(initialRateState);
  });

  it('should update the state with currency rates on loadCurrencyRateListActionSuccess', () => {
    const currencyRates = [
      { pair: 'EUR_PLN', buyRate: 1, buyAmount: 2, sellRate: 2, sellAmount: 4 },
      { pair: 'EUR_USD', buyRate: 1, buyAmount: 2, sellRate: 2, sellAmount: 4 },
    ] as CurrencyRate[];
    const action = loadCurrencyRateListActionSuccess({ currencyRates });
    const expectedState = {
      ...initialRateState,
      currencyRates,
    };

    const state = rateReducers(initialRateState, action);
    expect(state).toEqual(expectedState);
  });
});
