import {
  loadFinancialReportPdfDocumentAction,
  loadFinancialReportPdfDocumentFailure,
  loadFinancialReportPdfDocumentSuccess
} from './report.actions';
import { FinancialReportRequest } from '../../api';
import { HttpErrorResponse } from '@angular/common/http';

describe('Report Actions', () => {
  it('should create an action to load financial report document pdf', () => {
    const financialReportRequest: FinancialReportRequest = {
      month: 4,
      year: 2025,
      userAccountID: ''
    };
    const action = loadFinancialReportPdfDocumentAction({ financialReportRequest });
    expect(action.type).toBe('[Reports] Load Financial Report Document Action');
  });

  it('should create an action for loading financial report document pdf success', () => {
    const action = loadFinancialReportPdfDocumentSuccess();
    expect(action.type).toBe('[Reports] Load Financial Report Document Success');
  });
  it('should create an action for loading financial report document pdf error', () => {
    const errorResponse = new HttpErrorResponse({});
    const action = loadFinancialReportPdfDocumentFailure({ errorResponse });
    expect(action.type).toBe('[Reports] Load Financial Report Document Failure');
    expect(action.errorResponse).toEqual(errorResponse);
  });
});
