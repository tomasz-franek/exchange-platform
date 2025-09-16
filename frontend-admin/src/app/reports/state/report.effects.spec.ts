import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { ReportEffects } from './report.effects';
import { ApiService } from '../../../services/api.service';
import { cold, hot } from 'jasmine-marbles';
import { HttpErrorResponse } from '@angular/common/http';
import {
  deleteErrorAction,
  deleteErrorFailure,
  deleteErrorSuccess,
  generateAccountsReportAction,
  generateAccountsReportFailure,
  generateAccountsReportSuccess,
  loadErrorListAction,
  loadErrorListFailure,
  loadErrorListSuccess,
} from './report.actions';
import { AccountsReportRequest } from '../../api/model/accountsReportRequest';
import { AccountsReportResponse } from '../../api/model/accountsReportResponse';
import { ErrorListRequest } from '../../api/model/errorListRequest';
import { ErrorMessage } from '../../api/model/errorMessage';

describe('ReportEffects', () => {
  let actions$: Actions;
  let effects: ReportEffects;
  let apiService: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'generateAccountsReport',
      'loadErrorList',
      'deleteError',
    ]);

    TestBed.configureTestingModule({
      providers: [
        ReportEffects,
        provideMockActions(() => actions$),
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    });

    effects = TestBed.inject(ReportEffects);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });
  describe('loadAccountsReport$', () => {
    it('should return generateAccountsReportSuccess on successful load', () => {
      const accountsReportRequest: AccountsReportRequest = {
        userId: '1',
        dateFromUtc: '',
        dateToUtc: '',
      };
      const action = generateAccountsReportAction({ accountsReportRequest });
      const accountsReportResponse = [
        {
          reportDateUtc: '2020-01-01',
          currency: 'USD',
          amountCancellations: 21,
          amountCorrections: 34,
          amountDeposits: 164,
          amountExchanges: 67,
          amountFees: 38,
          amountWithdraws: 125,
        },
      ] as AccountsReportResponse[];
      const completion = generateAccountsReportSuccess({
        accountsReportResponse,
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', { b: accountsReportResponse });
      apiService.generateAccountsReport.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadAccountsReport$).toBeObservable(expected);
    });

    it('should return generateAccountsReportFailure on error', () => {
      const accountsReportRequest: AccountsReportRequest = {
        userId: '1',
        dateFromUtc: '',
        dateToUtc: '',
      };
      const action = generateAccountsReportAction({ accountsReportRequest });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = generateAccountsReportFailure({
        errorResponse,
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.generateAccountsReport.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadAccountsReport$).toBeObservable(expected);
    });
  });
  describe('loadErrorList$', () => {
    it('should return generateAccountsReportSuccess on successful load', () => {
      const errorListRequest: ErrorListRequest = {
        offset: 12,
      };
      const action = loadErrorListAction({ errorListRequest });
      const errorMessageList: ErrorMessage[] = [
        {
          id: '12',
          message: 'aa',
          timestamp: 442,
          offset: 34,
        },
        {
          id: '13',
          message: 'bb',
          timestamp: 994,
          offset: 35,
        },
      ];
      const completion = loadErrorListSuccess({
        errorMessageList,
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', { b: errorMessageList });
      apiService.loadErrorList.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadErrorList$).toBeObservable(expected);
    });

    it('should return loadErrorListFailure on error', () => {
      const errorListRequest: ErrorListRequest = {
        offset: 12,
      };
      const action = loadErrorListAction({ errorListRequest });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = loadErrorListFailure({
        errorResponse,
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.loadErrorList.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.loadErrorList$).toBeObservable(expected);
    });
  });

  describe('deleteError$', () => {
    it('should return deleteErrorSuccess on successful delete error', () => {
      const action = deleteErrorAction({ id: 1 });
      const completion1 = deleteErrorSuccess();
      const completion2 = loadErrorListAction({
        errorListRequest: { offset: 0 },
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-b|', { b: {} });
      apiService.deleteError.and.returnValue(response);

      const expected = cold('--(cd)', { c: completion1, d: completion2 });
      expect(effects.deleteError$).toBeObservable(expected);
    });

    it('should return loadErrorListFailure on error', () => {
      const action = deleteErrorAction({ id: 1 });
      const errorResponse = new HttpErrorResponse({ error: 'Error' });
      const completion = deleteErrorFailure({
        errorResponse,
      });

      actions$ = hot('-a-', { a: action });
      const response = cold('-#', {}, errorResponse);
      apiService.deleteError.and.returnValue(response);

      const expected = cold('--c', { c: completion });
      expect(effects.deleteError$).toBeObservable(expected);
    });
  });
});
