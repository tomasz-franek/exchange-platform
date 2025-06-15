import { CurrencyRate } from '../../api';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../features';

export interface RateState {
  currencyRates: CurrencyRate[];
}
export const selectRateFutureState = createFeatureSelector<RateState>(
  Features.rates,
);

export const selectCurrencyRates = createSelector(
  selectRateFutureState,
  (state) => state.currencyRates,
);
