import {createFeatureSelector, createSelector} from '@ngrx/store';
import {Features} from '../../features';
import {BuildInfo} from '../../api/model/buildInfo';

export interface UtilState {
  buildInfo: BuildInfo | undefined;
}

export const selectStatisticFutureState = createFeatureSelector<UtilState>(
  Features.utils,
);

export const selectBuildInfo = createSelector(
  selectStatisticFutureState,
  (state: UtilState) => state.buildInfo,
);

