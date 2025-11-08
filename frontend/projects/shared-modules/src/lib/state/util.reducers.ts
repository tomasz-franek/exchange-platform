import {UtilState} from './util.selectors';
import {createReducer, on} from '@ngrx/store';
import {loadBuildInfoSuccess} from './util.actions';
import {BuildInfo} from '../api/model/buildInfo';

export const initialUtilState: UtilState = {
  buildInfo: {} as BuildInfo,
};

export const utilReducers = createReducer(
  initialUtilState,
  on(loadBuildInfoSuccess, (state, action) => {
    return {...state, buildInfo: action.buildInfo};
  })
);
