import { HttpErrorResponse } from '@angular/common/http';
import {
  loadMessageListAction,
  loadMessageListActionFailure,
  loadMessageListActionSuccess
} from './message.actions';
import { SystemMessage } from '../../api/model/systemMessage';

describe('System Actions', () => {
  it('should create an action to load system message list info', () => {
    const action = loadMessageListAction();
    expect(action.type).toBe('[Message] Load Message List Action');
  });

  it('should create an action for loading system message list success', () => {
    const systemMessageList: SystemMessage[] = [];
    const action = loadMessageListActionSuccess({ systemMessageList });
    expect(action.type).toBe('[Message] Load Message List Action Success');
    expect(action.systemMessageList).toEqual(systemMessageList);
  });

  it('should create an action for loading system message list error', () => {
    const errorResponse = new HttpErrorResponse({});
    const action = loadMessageListActionFailure({ errorResponse });
    expect(action.type).toBe('[Message] Load Message List Action Failure');
    expect(action.errorResponse).toEqual(errorResponse);
  });
});
