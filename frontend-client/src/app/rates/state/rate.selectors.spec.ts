import { RateState, selectCurrencyRates } from './rate.selectors';

describe('Currency Rate Selectors', () => {
  const initialState: RateState = {
    currencyRates: [
      {
        pair: 'EUR_PLN',
        buyRate: 1,
        buyAmount: 2,
        sellRate: 2,
        sellAmount: 4,
      },
      {
        pair: 'EUR_USD',
        buyRate: 1,
        buyAmount: 2,
        sellRate: 2,
        sellAmount: 4,
      },
    ],
  };

  it('should select currency rates from the state', () => {
    const result = selectCurrencyRates.projector(initialState);
    expect(result).toEqual(initialState.currencyRates);
  });

  it('should return an empty array if no currency rates are present', () => {
    const state: RateState = {
      currencyRates: [],
    };

    const result = selectCurrencyRates.projector(state);
    expect(result).toEqual([]);
  });
});
