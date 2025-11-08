import {selectBuildInfo, UtilState} from "./util.selectors";

describe('Utils Selectors', () => {
  const mockState: UtilState = {
    buildInfo: {
      buildTime: 'buildTime',
      commitTime: 'commitTime',
      commitHash: 'commitHash',
      branchName: 'branchName',
      moduleName: 'moduleName',
      versionNumber: 'versionNumber'
    }
  };
  it('should select the accounts report response', () => {
    const result = selectBuildInfo.projector(mockState);
    expect(result).toEqual(mockState.buildInfo);
  });
});
