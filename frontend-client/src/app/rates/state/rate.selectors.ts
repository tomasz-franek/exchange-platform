import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../../features';
import { CurrencyRate } from '../../api/model/currencyRate';

export interface RateState {
  currencyRates: CurrencyRate[];
}

export const selectRateFutureState = createFeatureSelector<RateState>(
  Features.rates
);

export const selectCurrencyRates = createSelector(
  selectRateFutureState,
  (state) => state.currencyRates
);
