import { createFeatureSelector, createSelector } from '@ngrx/store';
import {Features} from '../../../../../shared-modules/src/lib/features';
import { AccountsReportResponse } from '../../api/model/accountsReportResponse';
import { ErrorMessage } from '../../api/model/errorMessage';

export interface ReportState {
  accountsReportResponse: AccountsReportResponse[];
  errorMessageList: ErrorMessage[];
}

export const selectReportFutureState = createFeatureSelector<ReportState>(
  Features.reports,
);

export const selectAccountsReportResponse = createSelector(
  selectReportFutureState,
  (state: ReportState) => state.accountsReportResponse,
);
export const selectErrorMessageList = createSelector(
  selectReportFutureState,
  (state: ReportState) => state.errorMessageList,
);
