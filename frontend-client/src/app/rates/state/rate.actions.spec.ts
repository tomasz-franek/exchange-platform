import { CurrencyRate } from '../../api';
import { HttpErrorResponse } from '@angular/common/http';
import {
  loadCurrencyRateListAction,
  loadCurrencyRateListActionFailure,
  loadCurrencyRateListActionSuccess
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
        sellAmount: 4
      },
      { pair: 'EUR_USD', buyRate: 1, buyAmount: 2, sellRate: 2, sellAmount: 4 }
    ];
    const action = loadCurrencyRateListActionSuccess({ currencyRates });
    expect(action.type).toBe('[RATE] Load currency rate list success');
    expect(action.currencyRates).toEqual(currencyRates);
  });

  it('should create an action for loading currency rate list error', () => {
    const errorResponse = new HttpErrorResponse({});
    const action = loadCurrencyRateListActionFailure({ errorResponse });
    expect(action.type).toBe('[RATE] Load currency rate list Failure');
    expect(action.errorResponse).toEqual(errorResponse);
  });
});
