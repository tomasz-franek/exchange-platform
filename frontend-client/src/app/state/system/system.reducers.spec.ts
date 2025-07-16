import { initialSystemState, systemReducers } from './system.reducers';
import {
  loadBuildInfoActionSuccess,
  loadSystemMessageListActionSuccess,
} from './system.actions';
import { BuildInfo } from '../../api/model/buildInfo';
import { SystemMessage } from '../../api/model/systemMessage';

describe('System Reducers', () => {
  it('should return the initial state when no action is passed', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = systemReducers(undefined, action);
    expect(state).toEqual(initialSystemState);
  });

  it('should update the state with build info on loadBuildInfoActionSuccess', () => {
    const buildInfo: BuildInfo = {
      commitTime: '',
      buildTime: '',
      branchName: '',
      versionNumber: '',
      moduleName: '',
    };
    const action = loadBuildInfoActionSuccess({ buildInfo });
    const expectedState = {
      ...initialSystemState,
      buildInfo,
    };

    const state = systemReducers(initialSystemState, action);
    expect(state).toEqual(expectedState);
  });

  it('should update the state with currency rates on loadSystemMessageListActionSuccess', () => {
    const systemMessageList: SystemMessage[] = [
      { id: '1', messageText: 'a', priority: 1 },
      { id: '2', messageText: 'b', priority: 2 },
    ];
    const action = loadSystemMessageListActionSuccess({ systemMessageList });
    const expectedState = {
      ...initialSystemState,
      systemMessageList,
    };

    const state = systemReducers(initialSystemState, action);
    expect(state).toEqual(expectedState);
  });
});
