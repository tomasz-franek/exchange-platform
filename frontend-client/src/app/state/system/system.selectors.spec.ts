import {
  selectBuildInfo,
  selectSystemMessageList,
  SystemState,
} from './system.selectors';

describe('System Selectors', () => {
  const initialState: SystemState = {
    buildInfo: {
      buildTime: '',
      moduleName: 'test',
      branchName: 'branch',
      commitHash: 'hash',
      commitTime: 'commit time',
      versionNumber: 'version number',
    },
    systemMessageList: [
      {
        messageText: 'message',
        id: 'id',
        priority: 10,
      },
    ],
  };

  it('should select build info from the state', () => {
    const result = selectBuildInfo.projector(initialState);
    expect(result).toEqual(initialState.buildInfo);
  });

  it('should return an empty array if no currency rates are present', () => {
    const result = selectSystemMessageList.projector(initialState);
    expect(result).toEqual(initialState.systemMessageList);
  });
});
