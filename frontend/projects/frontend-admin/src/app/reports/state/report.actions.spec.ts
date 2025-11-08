import {
  deleteErrorAction,
  deleteErrorFailure,
  deleteErrorSuccess,
  generateAccountsReportAction,
  generateAccountsReportFailure,
  generateAccountsReportSuccess,
  loadErrorListAction,
  loadErrorListFailure,
  loadErrorListSuccess
} from './report.actions';
import { AccountsReportRequest } from '../../api/model/accountsReportRequest';
import { ErrorListRequest } from '../../api/model/errorListRequest';
import { AccountsReportResponse } from '../../api/model/accountsReportResponse';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMessage } from '../../api/model/errorMessage';

describe('Report Actions', () => {
  describe('generateAccountsReportAction', () => {
    it('should create an action to generate accounts report', () => {
      const accountsReportRequest: AccountsReportRequest = {
        userId: '',
        dateFromUtc: '',
      };
      const action = generateAccountsReportAction({ accountsReportRequest });
      expect(action.type).toBe('[Reports] Generate Accounts Report');
      expect(action.accountsReportRequest).toEqual(accountsReportRequest);
    });
  });

  describe('generateAccountsReportSuccess', () => {
    it('should create an action to generate accounts report success', () => {
      const accountsReportResponse: AccountsReportResponse[] = [
        {
          reportDateUtc: '2022-04-01',
          currency: 'EUR',
          amountCancellations: 65,
          amountCorrections: 34,
          amountDeposits: 11,
          amountExchanges: 35,
          amountFees: 1,
          amountWithdraws: 0,
        },
      ];
      const action = generateAccountsReportSuccess({ accountsReportResponse });
      expect(action.type).toBe('[Reports] Generate Accounts Report Success');
      expect(action.accountsReportResponse).toEqual(accountsReportResponse);
    });
  });

  describe('generateAccountsReportSuccess', () => {
    it('should create an action to generate accounts report failure', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Error message',
        status: 404,
      });
      const action = generateAccountsReportFailure({ errorResponse });
      expect(action.type).toBe('[Reports] Generate Accounts Report Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('loadErrorListAction', () => {
    it('should create an action to Load Error List', () => {
      let errorListRequest = {
        offset: 4,
      } as ErrorListRequest;
      const action = loadErrorListAction({ errorListRequest });
      expect(action.type).toBe('[Reports] Load Error List Action');
      expect(action.errorListRequest).toEqual(errorListRequest);
    });
  });

  describe('loadErrorListSuccess', () => {
    it('should create an action to Load Error List Success', () => {
      let errorMessageList = [
        {
          id: 'id',
          message: 'message',
        },
      ] as ErrorMessage[];
      const action = loadErrorListSuccess({ errorMessageList });
      expect(action.type).toBe('[Reports] Load Error List Success');
      expect(action.errorMessageList).toEqual(errorMessageList);
    });
  });

  describe('loadErrorListFailure', () => {
    it('should create an action to Load Error List Failure', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Error message',
        status: 404,
      });
      const action = loadErrorListFailure({ errorResponse });
      expect(action.type).toBe('[Reports] Load Error List Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('deleteErrorAction', () => {
    it('should create an action to delete error', () => {
      const action = deleteErrorAction({ id: 1 });
      expect(action.type).toBe('[Reports] Delete Error');
      expect(action.id).toEqual(1);
    });
  });

  describe('deleteErrorSuccess', () => {
    it('should create an action delete Error Success', () => {
      const action = deleteErrorSuccess();
      expect(action.type).toBe('[Reports] Delete Error Success');
    });
  });

  describe('deleteErrorFailure', () => {
    it('should create an action to Delete Error List Failure', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Error message',
        status: 404,
      });
      const action = deleteErrorFailure({ errorResponse });
      expect(action.type).toBe('[Reports] Delete Error Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });
});
