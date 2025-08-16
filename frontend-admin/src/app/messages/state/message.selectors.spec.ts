import {
  MessageState,
  selectEditedSystemMessages,
  selectSystemMessages,
} from './message.selectors';

describe('Message Selectors', () => {
  const mockState: MessageState = {
    editedSystemMessage: {
      messageText: 'Hello World!',
      priority: 1,
      active: false,
      version: 0,
    },
    systemMessages: [
      {
        priority: 2,
        active: true,
        version: 1,
        messageText: 'Hello World!',
        id: '1',
      },
      {
        priority: 2,
        active: false,
        version: 1,
        messageText: 'Hello World!',
        id: '2',
      },
    ],
  };
  it('should select the edited System Message', () => {
    const result = selectEditedSystemMessages.projector(mockState);
    expect(result).toEqual(mockState.editedSystemMessage);
  });

  it('should select the System Message List', () => {
    const result = selectSystemMessages.projector(mockState);
    expect(result).toEqual(mockState.systemMessages);
  });
});
