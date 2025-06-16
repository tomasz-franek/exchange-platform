import { createReducer, on } from '@ngrx/store';
import { RateState } from './rate.selectors';
import { loadCurrencyRateListActionSuccess } from './rate.actions';

export const initialRateState: RateState = {
  currencyRates: [],
};

export const rateReducers = createReducer(
  initialRateState,
  on(loadCurrencyRateListActionSuccess, (state, action) => {
    return { ...state, currencyRates: action.currencyRates };
  }),
);
