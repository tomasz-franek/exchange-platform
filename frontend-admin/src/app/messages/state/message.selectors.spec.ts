import {MessageState, selectEditedSystemMessages} from "./message.selectors";

describe('Message Selectors', () => {
  const mockState: MessageState = {
    editedSystemMessage: {
      messageText: "Hello World!",
      priority: 1,
      active: false,
      version: 0,
    }
  };
  it('should select the edited System Message', () => {
    const result = selectEditedSystemMessages.projector(mockState);
    expect(result).toEqual(mockState.editedSystemMessage);
  });
});
