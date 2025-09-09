import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../../features';
import { UsersStatisticResponse } from '../../api/model/usersStatisticResponse';
import { CurrencyStatisticResponse } from '../../api/model/currencyStatisticResponse';
import { PairStatisticResponse } from '../../api/model/pairStatisticResponse';

export interface StatisticState {
  usersStatisticResponse: UsersStatisticResponse | null;
  currencyStatisticResponse: CurrencyStatisticResponse | null;
  pairStatisticResponse: PairStatisticResponse | null;
}

export const selectStatisticFutureState = createFeatureSelector<StatisticState>(
  Features.statistics,
);

export const selectUsersStatisticResponse = createSelector(
  selectStatisticFutureState,
  (state: StatisticState) => state.usersStatisticResponse,
);

export const selectPairStatisticResponse = createSelector(
  selectStatisticFutureState,
  (state: StatisticState) => state.pairStatisticResponse,
);

export const selectCurrencyStatisticResponse = createSelector(
  selectStatisticFutureState,
  (state: StatisticState) => state.currencyStatisticResponse,
);
