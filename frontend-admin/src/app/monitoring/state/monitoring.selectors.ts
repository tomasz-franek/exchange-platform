import {createFeatureSelector, createSelector} from "@ngrx/store";
import {Features} from "../../features";

export interface MonitoringState {
  adminHealthCheck: object;
  externalHealthCheck: object;
  internalHealthCheck: object;
}

export const selectMonitoringFutureState = createFeatureSelector<MonitoringState>(
  Features.monitoring,
);


export const selectAdminHealthCheck = createSelector(
  selectMonitoringFutureState,
  (state: MonitoringState) => state.adminHealthCheck,
);

export const selectExternalHealthCheck = createSelector(
  selectMonitoringFutureState,
  (state: MonitoringState) => state.externalHealthCheck,
);

export const selectInternalHealthCheck = createSelector(
  selectMonitoringFutureState,
  (state: MonitoringState) => state.internalHealthCheck,
);
