import { Actions } from '@ngrx/effects';
import { ApiService } from '../../../services/api/api.service';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ReportEffects } from './report.effects';
import {
  loadFinancialReportPdfDocumentAction,
  loadFinancialReportPdfDocumentSuccess
} from './report.actions';
import { FinancialReportRequest } from '../../api';

describe('ReportEffects', () => {
  let effects: ReportEffects;
  let actions$: Actions;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadFinancialReportPdfDocument'
    ]);
    TestBed.configureTestingModule({
      providers: [
        ReportEffects,
        provideMockActions(() => actions$),
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });

    effects = TestBed.inject(ReportEffects);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should return loadFinancialReportPdfDocumentSuccess on successful pdf document', () => {
    const financialReportRequest: FinancialReportRequest = {
      year: 2025,
      month: 7,
      userAccountID: '12345'
    };

    const action = loadFinancialReportPdfDocumentAction({ financialReportRequest });
    const outcome = loadFinancialReportPdfDocumentSuccess();

    actions$ = hot('-a', { a: action });
    apiService.loadFinancialReportPdfDocument.and.returnValue(of(financialReportRequest) as any);
    const expected = cold('-c', { c: outcome });
    expect(effects.loadFinancialReportPdfDocument$).toBeObservable(expected);
  });

  it('should return loadCurrencyRateListActionFailure on failed loadCurrencyRates', () => {
    const errorResponse = new HttpErrorResponse({});
    apiService.loadFinancialReportPdfDocument.and.returnValue(
      throwError(() => errorResponse)
    );
    const financialReportRequest: FinancialReportRequest = {
      year: 2025,
      month: 7,
      userAccountID: '12345'
    };
    actions$ = of(loadFinancialReportPdfDocumentAction({ financialReportRequest }));

    effects.loadFinancialReportPdfDocument$.subscribe((action) => {
      expect(action).toEqual({
        type: '[Reports] Load Financial Report Document Failure',
        errorResponse
      });
      expect(apiService.loadFinancialReportPdfDocument).toHaveBeenCalled();
    });
  });
});
