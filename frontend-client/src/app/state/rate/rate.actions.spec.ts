import { CurrencyRate } from '../../api';
import { HttpErrorResponse } from '@angular/common/http';
import {
  loadCurrencyRateListAction,
  loadCurrencyRateListActionError,
  loadCurrencyRateListActionSuccess,
} from './rate.actions';

describe('Currency Rate Actions', () => {
  it('should create an action to load currency rate list', () => {
    const action = loadCurrencyRateListAction();
    expect(action.type).toBe('[RATE] Load currency rate list');
  });

  it('should create an action for loading currency rate list success', () => {
    const currencyRates: CurrencyRate[] = [
      {
        pair: 'EUR_PLN',
        buyRate: 1,
        buyAmount: 2,
        sellRate: 2,
        sellAmount: 4,
      },
      { pair: 'EUR_USD', buyRate: 1, buyAmount: 2, sellRate: 2, sellAmount: 4 },
    ];
    const action = loadCurrencyRateListActionSuccess({ currencyRates });
    expect(action.type).toBe('[RATE] Load currency rate list success');
    expect(action.currencyRates).toEqual(currencyRates);
  });

  it('should create an action for loading currency rate list error', () => {
    const error = new HttpErrorResponse({});
    const action = loadCurrencyRateListActionError({ error });
    expect(action.type).toBe('[RATE] Load currency rate list error');
    expect(action.error).toEqual(error);
  });
});
