import {
  ReportState,
  selectAccountsReportResponse,
  selectErrorMessageList,
} from './report.selectors';
import { AccountsReportResponse } from '../../api/model/accountsReportResponse';

describe('Report Selectors', () => {
  const mockState: ReportState = {
    accountsReportResponse: {
      reportDateUTC: 'test',
    } as AccountsReportResponse,
    errorMessageList: [
      {
        id: '1',
        message: 'message1',
      },
      {
        id: '2',
        message: 'message2',
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
