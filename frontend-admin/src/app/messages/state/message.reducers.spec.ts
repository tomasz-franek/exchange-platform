import {initialMessageState, messageReducers} from "./message.reducers";
import {saveSystemMessageSuccess} from "./message.actions";
import {SystemMessage} from "../../api/model/systemMessage";

describe('messageReducers', () => {
  it('should return the initial state', () => {
    const action = {type: 'UNKNOWN_ACTION'};
    const state = messageReducers(undefined, action);
    expect(state).toBe(initialMessageState);
  });

  it('should handle saveSystemMessageSuccess', () => {
    const systemMessage: SystemMessage = {
      messageText: "Hello World!",
      priority: 1,
      active: false,
      version: 0,
    };
    const action = saveSystemMessageSuccess({systemMessage});
    const state = messageReducers(initialMessageState, action);

    expect(state).toEqual({
      ...initialMessageState, editedSystemMessage: systemMessage,
    });
  });
});
