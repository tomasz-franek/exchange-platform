import { MessageState, selectSystemMessageList } from './message.selectors';

describe('Message Selectors', () => {
  const initialState: MessageState = {
    systemMessageList: [
      {
        messageText: 'message',
        id: 'id',
        priority: 10,
      },
    ],
  };

  it('should return an empty array if no currency rates are present', () => {
    const result = selectSystemMessageList.projector(initialState);
    expect(result).toEqual(initialState.systemMessageList);
  });
});
