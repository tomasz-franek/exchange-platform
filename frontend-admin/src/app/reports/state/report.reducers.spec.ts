import { initialReportState, reportReducers } from './report.reducers';
import {
  generateAccountsReportSuccess,
  loadErrorListSuccess,
} from './report.actions';
import { AccountsReportResponse } from '../../api/model/accountsReportResponse';
import { ErrorMessage } from '../../api/model/errorMessage';

describe('reportReducers', () => {
  it('should return the initial state', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = reportReducers(undefined, action);
    expect(state).toBe(initialReportState);
  });

  it('should handle generateAccountsReportSuccess', () => {
    const accountsReportResponse: AccountsReportResponse = {
      reportDateUtc: '',
    };
    const action = generateAccountsReportSuccess({ accountsReportResponse });
    const state = reportReducers(initialReportState, action);

    expect(state.accountsReportResponse).toEqual(accountsReportResponse);
  });

  it('should handle loadErrorListSuccess', () => {
    let errorMessageList = [
      {
        id: 'id',
        message: 'message',
      },
    ] as ErrorMessage[];
    const action = loadErrorListSuccess({ errorMessageList });
    const state = reportReducers(initialReportState, action);

    expect(state.errorMessageList).toEqual(errorMessageList);
  });
});
