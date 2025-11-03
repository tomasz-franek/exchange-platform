import {createFeatureSelector, createSelector} from '@ngrx/store';
import {BuildInfo} from '../api/model/buildInfo';

export interface UtilState {
  buildInfo: BuildInfo;
}

export const selectStatisticFutureState = createFeatureSelector<UtilState>(
 "utils",
);

export const selectBuildInfo = createSelector(
  selectStatisticFutureState,
  (state: UtilState) => state.buildInfo,
);

