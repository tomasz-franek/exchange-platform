import {
  ReportState,
  selectAccountsReportResponse,
  selectErrorMessageList,
} from './report.selectors';
import { AccountsReportResponse } from '../../api/model/accountsReportResponse';

describe('Report Selectors', () => {
  const mockState: ReportState = {
    accountsReportResponse: [
      {
        reportDateUtc: '2020-01-01',
        currency: 'USD',
        amountCancellations: 1,
        amountCorrections: 3,
        amountDeposits: 14,
        amountExchanges: 43,
        amountFees: 3,
        amountWithdraws: 15,
      },
    ] as AccountsReportResponse[],
    errorMessageList: [
      {
        id: '1',
        message: 'message1',
        timestamp: 1,
        offset: 1,
      },
      {
        id: '2',
        message: 'message2',
        timestamp: 12,
        offset: 2,
      },
    ],
  };
  it('should select the accounts report response', () => {
    const result = selectAccountsReportResponse.projector(mockState);
    expect(result).toEqual(mockState.accountsReportResponse);
  });
  it('should select the error message list', () => {
    const result = selectErrorMessageList.projector(mockState);
    expect(result).toEqual(mockState.errorMessageList);
  });
});
