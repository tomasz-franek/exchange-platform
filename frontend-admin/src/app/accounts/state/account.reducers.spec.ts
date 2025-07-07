import {accountReducers, initialAccountState} from './account.reducers';

describe('accountReducers', () => {
  it('should return the initial state when no action is passed', () => {
    const newState = accountReducers(undefined, {
      type: '',
    });
    expect(newState).toEqual(initialAccountState);
  });
});
