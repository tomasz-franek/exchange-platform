import {saveSystemMessageAction} from "./message.actions";
import {SystemMessage} from "../../api/model/systemMessage";

describe('Messages Actions', () => {
  describe('saveSystemMessageAction', () => {
    it('should create an action to save system message action', () => {
      const systemMessage: SystemMessage = {
        messageText: "Hello World!",
        priority: 1,
        active: false,
        version: 0,
      };
      const action = saveSystemMessageAction({systemMessage});
      expect(action.type).toBe('[Message] Saving system message Action',);
      expect(action.systemMessage).toEqual(systemMessage);
    });
  });
});