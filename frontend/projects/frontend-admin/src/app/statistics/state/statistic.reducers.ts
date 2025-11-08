import { StatisticState } from './statistic.selectors';
import { createReducer, on } from '@ngrx/store';
import {
  loadCurrencyStatisticSuccess,
  loadPairStatisticSuccess,
  loadUserStatisticSuccess,
} from './statistic.actions';

export const initialStatisticState: StatisticState = {
  usersStatisticResponse: null,
  currencyStatisticResponse: null,
  pairStatisticResponse: null,
};

export const statisticReducers = createReducer(
  initialStatisticState,
  on(loadUserStatisticSuccess, (state, action) => {
    return { ...state, usersStatisticResponse: action.usersStatisticResponse };
  }),
  on(loadPairStatisticSuccess, (state, action) => {
    return { ...state, pairStatisticResponse: action.pairStatisticResponse };
  }),
  on(loadCurrencyStatisticSuccess, (state, action) => {
    return {
      ...state,
      currencyStatisticResponse: action.currencyStatisticResponse,
    };
  }),
);
