import {UsersStatisticRequest} from "../../api/model/usersStatisticRequest";
import {loadUserStatisticAction} from "./statistic.actions";

describe('Statistic Actions', () => {
  describe('loadUserStatisticAction', () => {
    it('should create an action to load user statistic', () => {
      const usersStatisticRequest: UsersStatisticRequest = {
        userId: ''
      };
      const action = loadUserStatisticAction({usersStatisticRequest});
      expect(action.type).toBe('[Statistic] Load User Statistic Action',);
      expect(action.usersStatisticRequest).toEqual(usersStatisticRequest);
    });
  });
});
