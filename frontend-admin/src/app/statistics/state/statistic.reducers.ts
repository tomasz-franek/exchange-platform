import {StatisticState} from './statistic.selectors';
import {createReducer, on} from '@ngrx/store';
import {loadUserStatisticSuccess} from "./statistic.actions";

export const initialStatisticState: StatisticState = {
  usersStatisticResponse: null
};

export const statisticReducers = createReducer(
    initialStatisticState,
    on(loadUserStatisticSuccess, (state, action) => {
      return {...state, usersStatisticResponse: action.usersStatisticResponse};
    })
);
