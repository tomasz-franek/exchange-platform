import { createReducer, on } from '@ngrx/store';
import { SystemState } from './system.selectors';
import {
  loadBuildInfoActionSuccess,
  loadSystemMessageListActionSuccess,
} from './system.actions';

export const initialSystemState: SystemState = {
  buildInfo: undefined,
  systemMessageList: [],
};

export const systemReducers = createReducer(
  initialSystemState,
  on(loadBuildInfoActionSuccess, (state, action) => {
    return { ...state, buildInfo: action.buildInfo };
  }),
  on(loadSystemMessageListActionSuccess, (state, action) => {
    return { ...state, systemMessageList: action.systemMessageList };
  }),
);
