import {initialStatisticState, statisticReducers} from './statistic.reducers';
import {loadUserStatisticSuccess} from "./statistic.actions";
import {UsersStatisticResponse} from "../../api/model/usersStatisticResponse";

describe('statisticReducers', () => {
  it('should return the initial state', () => {
    const action = {type: 'UNKNOWN_ACTION'};
    const state = statisticReducers(undefined, action);
    expect(state).toBe(initialStatisticState);
  });
  it('should handle loadAccountListSuccess', () => {
    const usersStatisticResponse: UsersStatisticResponse = {
      active: 1,
      all: 2,
      blocked: 3
    };
    const action = loadUserStatisticSuccess({usersStatisticResponse});
    const state = statisticReducers(initialStatisticState, action);

    expect(state.usersStatisticResponse).toEqual(usersStatisticResponse);
  });
});
