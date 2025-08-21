import { ReportState } from './report.selectors';
import { createReducer, on } from '@ngrx/store';
import {
  generateAccountsReportSuccess,
  loadErrorListSuccess,
} from './report.actions';

export const initialReportState: ReportState = {
  accountsReportResponse: null,
  errorMessageList: [],
};

export const reportReducers = createReducer(
  initialReportState,
  on(generateAccountsReportSuccess, (state, action) => {
    return { ...state, accountsReportResponse: action.accountsReportResponse };
  }),
  on(loadErrorListSuccess, (state, action) => {
    return { ...state, errorMessageList: action.errorMessageList };
  }),
);
