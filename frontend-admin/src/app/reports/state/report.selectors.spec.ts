import {ReportState, selectAccountsReportResponse} from "./report.selectors";
import {AccountsReportResponse} from "../../api/model/accountsReportResponse";

describe('Report Selectors', () => {
  const mockState: ReportState = {
    accountsReportResponse: {
      reportDateUTC: 'test'
    } as AccountsReportResponse
  };
  it('should select the accounts report response', () => {
    const result = selectAccountsReportResponse.projector(mockState);
    expect(result).toEqual(mockState.accountsReportResponse);
  });
});
