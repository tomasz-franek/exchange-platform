import {createFeatureSelector, createSelector} from '@ngrx/store';
import {Features} from '../../features';
import {AccountsReportResponse} from "../../api/model/accountsReportResponse";

export interface ReportState {
  accountsReportResponse: AccountsReportResponse | null
}

export const selectReportFutureState = createFeatureSelector<ReportState>(
    Features.reports,
);

export const selectAccountsReportResponse = createSelector(
    selectReportFutureState,
    (state: ReportState) => state.accountsReportResponse,
);

