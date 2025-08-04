import {createFeatureSelector, createSelector} from "@ngrx/store";
import {Features} from "../../features";

export interface MonitoringState {
  adminHealthCheck: object;
  externalHealthCheck: object;
  internalHealthCheck: object;
}

export const selectMessageFutureState = createFeatureSelector<MonitoringState>(
  Features.messages,
);


export const selectAdminHealthCheck = createSelector(
  selectMessageFutureState,
  (state: MonitoringState) => state.adminHealthCheck,
);

export const selectExternalHealthCheck = createSelector(
  selectMessageFutureState,
  (state: MonitoringState) => state.externalHealthCheck,
);

export const selectInternalHealthCheck = createSelector(
  selectMessageFutureState,
  (state: MonitoringState) => state.internalHealthCheck,
);
