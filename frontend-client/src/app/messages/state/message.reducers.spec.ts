import { initialMessageState, messageReducers } from './message.reducers';
import { SystemMessage } from '../../api/model/systemMessage';
import { loadMessageListActionSuccess } from './message.actions';

describe('System Reducers', () => {
  it('should return the initial state when no action is passed', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = messageReducers(undefined, action);
    expect(state).toEqual(initialMessageState);
  });

  it('should update the state with currency rates on loadSystemMessageListActionSuccess', () => {
    const systemMessageList: SystemMessage[] = [
      { id: '1', messageText: 'a', priority: 1 },
      { id: '2', messageText: 'b', priority: 2 },
    ];
    const action = loadMessageListActionSuccess({ systemMessageList });
    const expectedState = {
      ...initialMessageState,
      systemMessageList,
    };

    const state = messageReducers(initialMessageState, action);
    expect(state).toEqual(expectedState);
  });
});
