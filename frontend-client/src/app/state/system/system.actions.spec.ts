import { HttpErrorResponse } from '@angular/common/http';
import {
  loadBuildInfoAction,
  loadBuildInfoActionError,
  loadBuildInfoActionSuccess,
  loadSystemMessageListAction,
  loadSystemMessageListActionError,
  loadSystemMessageListActionSuccess,
} from './system.actions';
import { BuildInfo } from '../../api/model/buildInfo';
import { SystemMessage } from '../../api/model/systemMessage';

describe('System Actions', () => {
  it('should create an action to load build info', () => {
    const action = loadBuildInfoAction();
    expect(action.type).toBe('[System] Load BuildInfo');
  });

  it('should create an action for loading build info success', () => {
    const buildInfo: BuildInfo = {
      commitTime: '',
      buildTime: '',
      branchName: '',
      versionNumber: '',
      moduleName: '',
    };
    const action = loadBuildInfoActionSuccess({ buildInfo });
    expect(action.type).toBe('[System] Load Build Info Action Success');
    expect(action.buildInfo).toEqual(buildInfo);
  });

  it('should create an action for loading build info error', () => {
    const error = new HttpErrorResponse({});
    const action = loadBuildInfoActionError({ error });
    expect(action.type).toBe('[System] Load Build Info Action Error');
    expect(action.error).toEqual(error);
  });

  it('should create an action to load system message list info', () => {
    const action = loadSystemMessageListAction();
    expect(action.type).toBe('[System] Load System Message List Action');
  });

  it('should create an action for loading system message list success', () => {
    const systemMessageList: SystemMessage[] = [];
    const action = loadSystemMessageListActionSuccess({ systemMessageList });
    expect(action.type).toBe(
      '[System] Load System Message List Action Success',
    );
    expect(action.systemMessageList).toEqual(systemMessageList);
  });

  it('should create an action for loading system message list error', () => {
    const error = new HttpErrorResponse({});
    const action = loadSystemMessageListActionError({ error });
    expect(action.type).toBe('[System] Load System Message List Action Error');
    expect(action.error).toEqual(error);
  });
});
