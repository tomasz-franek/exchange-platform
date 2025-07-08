import {createAction, props} from '@ngrx/store';
import {HttpErrorResponse} from '@angular/common/http';
import {AccountsReportRequest} from "../../api/model/accountsReportRequest";
import {AccountsReportResponse} from "../../api/model/accountsReportResponse";

export const generateAccountsReportAction = createAction(
    '[Reports] Generate Accounts Report',
    props<{ accountsReportRequest: AccountsReportRequest }>(),
);
export const generateAccountsReportSuccess = createAction(
    '[Reports] Generate Accounts Report Success',
    props<{ accountsReportResponse: AccountsReportResponse }>(),
);
export const generateAccountsReportFailure = createAction(
    '[Reports] Generate Accounts Report Failure',
    props<{
      error: HttpErrorResponse;
    }>(),
);
