import {initialUtilState, utilReducers} from './util.reducers';
import {loadBuildInfoSuccess} from "./util.actions";
import {BuildInfo} from '../api/model/buildInfo';

describe('utilReducers', () => {
  it('should return the initial state', () => {
    const action = {type: 'UNKNOWN_ACTION'};
    const state = utilReducers(undefined, action);
    expect(state).toBe(initialUtilState);
  });
  it('should handle loadBuildInfoSuccess', () => {
    const buildInfo: BuildInfo = {
      buildTime: 'buildTime',
      commitTime: 'commitTime',
      commitHash: 'commitHash',
      branchName: 'branchName',
      moduleName: 'moduleName',
      versionNumber: 'versionNumber'
    }
    const action = loadBuildInfoSuccess({buildInfo});
    const state = utilReducers(initialUtilState, action);

    expect(state.buildInfo).toEqual(buildInfo);
  });
});
