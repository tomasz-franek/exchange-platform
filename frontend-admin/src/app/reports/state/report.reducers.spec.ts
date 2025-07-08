import {initialAccountState, reportReducers} from './report.reducers';

describe('reportReducers', () => {
  it('should return the initial state when no action is passed', () => {
    const newState = reportReducers(undefined, {
      type: '',
    });
    expect(newState).toEqual(initialAccountState);
  });
});
