import {initialStatisticState, statisticReducers} from './statistic.reducers';

describe('statisticReducers', () => {
  it('should return the initial state when no action is passed', () => {
    const newState = statisticReducers(undefined, {
      type: '',
    });
    expect(newState).toEqual(initialStatisticState);
  });
});
