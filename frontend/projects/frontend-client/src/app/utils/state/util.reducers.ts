import {UtilState} from './util.selectors';
import {createReducer, on} from '@ngrx/store';
import {loadBuildInfoSuccess} from './util.actions';

export const initialUtilState: UtilState = {
  buildInfo: undefined,
};

export const utilReducers = createReducer(
  initialUtilState,
  on(loadBuildInfoSuccess, (state, action) => {
    return {...state, buildInfo: action.buildInfo};
  })
);
