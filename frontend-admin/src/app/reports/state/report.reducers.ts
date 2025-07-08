import {ReportState} from './report.selectors';
import {createReducer, on} from '@ngrx/store';
import {generateAccountsReportSuccess} from './report.actions';

export const initialAccountState: ReportState = {
  accountsReportResponse: null
};

export const reportReducers = createReducer(
    initialAccountState,
    on(generateAccountsReportSuccess, (state, action) => {
      return {...state, userAccounts: action.accountsReportResponse};
    })
);
