import {createFeatureSelector, createSelector} from '@ngrx/store';
import {Features} from '../../features';
import {UsersStatisticResponse} from "../../api/model/usersStatisticResponse";

export interface StatisticState {
  usersStatisticResponse: UsersStatisticResponse | null
}

export const selectStatisticFutureState = createFeatureSelector<StatisticState>(
    Features.statistics,
);

export const selectUsersStatisticResponse = createSelector(
    selectStatisticFutureState,
    (state: StatisticState) => state.usersStatisticResponse,
);

