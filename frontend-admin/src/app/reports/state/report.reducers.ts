import {ReportState} from './report.selectors';
import {createReducer, on} from '@ngrx/store';
import {generateAccountsReportSuccess} from './report.actions';

export const initialReportState: ReportState = {
  accountsReportResponse: null
};

export const reportReducers = createReducer(
    initialReportState,
    on(generateAccountsReportSuccess, (state, action) => {
      return {...state, userAccounts: action.accountsReportResponse};
    })
);
