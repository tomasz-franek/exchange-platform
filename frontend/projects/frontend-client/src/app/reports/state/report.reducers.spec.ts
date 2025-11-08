import { initialReportState, reportsReducers } from './report.reducers';

describe('Report Reducers', () => {
  it('should return the initial state when no action is passed', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = reportsReducers(undefined, action);
    expect(state).toEqual(initialReportState);
  });

});
