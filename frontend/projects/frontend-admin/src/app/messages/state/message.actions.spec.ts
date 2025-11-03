import {
  loadSystemMessageListAction,
  loadSystemMessageListFailure,
  loadSystemMessageListSuccess,
  saveSystemMessageAction,
  saveSystemMessageFailure,
  saveSystemMessageSuccess,
} from './message.actions';
import {SystemMessage} from '../../api/model/systemMessage';
import {HttpErrorResponse} from '@angular/common/http';
import {MessagePriority} from '../../api/model/messagePriority';

describe('Messages Actions', () => {
  describe('saveSystemMessageAction', () => {
    it('should create an action to save system message action', () => {
      const systemMessage: SystemMessage = {
        messageText: 'Hello World!',
        priority: MessagePriority.Medium,
        active: false,
        version: 0,
      };
      const action = saveSystemMessageAction({systemMessage});
      expect(action.type).toBe('[Message] Saving system message Action');
      expect(action.systemMessage).toEqual(systemMessage);
    });
  });

  describe('saveSystemMessageSuccess', () => {
    it('should create an action for successful loading of System Message', () => {
      const systemMessage: SystemMessage = {
        messageText: 'Hello World!',
        priority: MessagePriority.Medium,
        active: false,
        version: 0,
      };
      const action = saveSystemMessageSuccess({systemMessage});

      expect(action.type).toBe('[Message] Save system message Action success');
      expect(action.systemMessage).toEqual(systemMessage);
    });
  });

  describe('saveSystemMessageFailure', () => {
    it('should create an action for failed loading of System Message', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Error message',
        status: 404,
      });
      const action = saveSystemMessageFailure({errorResponse});

      expect(action.type).toBe('[Message] Save system message Action failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('loadSystemMessageListAction', () => {
    it('should create an action to load system message list action', () => {
      const action = loadSystemMessageListAction();
      expect(action.type).toBe('[Message] Load System Message List');
    });
  });

  describe('loadSystemMessageListSuccess', () => {
    it('should create an action for successful loading of System Message list', () => {
      const systemMessages: SystemMessage[] = [
        {
          messageText: 'Hello World!',
          priority: MessagePriority.Medium,
          active: false,
          version: 0,
        },
      ];
      const action = loadSystemMessageListSuccess({systemMessages});

      expect(action.type).toBe('[Message] Load System Message List Success');
      expect(action.systemMessages).toEqual(systemMessages);
    });
  });

  describe('loadSystemMessageListFailure', () => {
    it('should create an action for failed loading of System Message', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Error message',
        status: 404,
      });
      const action = loadSystemMessageListFailure({errorResponse});

      expect(action.type).toBe('[Message] Load System Message List Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });
});
