import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Features } from '../features';
import { BuildInfo } from '../../api/model/buildInfo';
import { SystemMessage } from '../../api/model/systemMessage';

export interface SystemState {
  buildInfo: BuildInfo | undefined;
  systemMessageList: SystemMessage[];
}

export const selectSystemFutureState = createFeatureSelector<SystemState>(
  Features.rates,
);

export const selectBuildInfo = createSelector(
  selectSystemFutureState,
  (state) => state.buildInfo,
);

export const selectSystemMessageList = createSelector(
  selectSystemFutureState,
  (state) => state.systemMessageList,
);
