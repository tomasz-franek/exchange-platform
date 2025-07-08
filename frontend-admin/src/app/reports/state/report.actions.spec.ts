import {generateAccountsReportAction} from "./report.actions";
import {AccountsReportRequest} from "../../api/model/accountsReportRequest";

describe('Report Actions', () => {
  describe('generateAccountsReportAction', () => {
    it('should create an action to generate accounts report', () => {
      const accountsReportRequest: AccountsReportRequest = {
        userId: ''
      };
      const action = generateAccountsReportAction({accountsReportRequest});
      expect(action.type).toBe('[Reports] Generate Accounts Report',);
      expect(action.accountsReportRequest).toEqual(accountsReportRequest);
    });
  });
});
