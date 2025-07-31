import {initialReportState, reportReducers} from './report.reducers';
import {generateAccountsReportSuccess} from "./report.actions";
import {AccountsReportResponse} from "../../api/model/accountsReportResponse";

describe('reportReducers', () => {
  it('should return the initial state', () => {
    const action = {type: 'UNKNOWN_ACTION'};
    const state = reportReducers(undefined, action);
    expect(state).toBe(initialReportState);
  });

  it('should handle generateAccountsReportSuccess', () => {
    const accountsReportResponse: AccountsReportResponse = {reportDateUTC: ''};
    const action = generateAccountsReportSuccess({accountsReportResponse});
    const state = reportReducers(initialReportState, action);

    expect(state.accountsReportResponse).toEqual(accountsReportResponse);
  });
});
