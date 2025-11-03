import { MessageState, selectSystemMessageList } from './message.selectors';
import { MessagePriority } from '../../api/model/messagePriority';

describe('Message Selectors', () => {
  const initialState: MessageState = {
    systemMessageList: [
      {
        messageText: 'message',
        id: 'id',
        priority: MessagePriority.Medium,
      },
    ],
  };

  it('should return an empty array if no currency rates are present', () => {
    const result = selectSystemMessageList.projector(initialState);
    expect(result).toEqual(initialState.systemMessageList);
  });
});
