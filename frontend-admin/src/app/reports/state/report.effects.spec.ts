import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Actions} from '@ngrx/effects';
import {ReportEffects} from './report.effects';
import {ApiService} from '../../../services/api.service';
import {cold, hot} from 'jasmine-marbles';
import {HttpErrorResponse} from '@angular/common/http';
import {
  generateAccountsReportAction,
  generateAccountsReportFailure,
  generateAccountsReportSuccess
} from "./report.actions";
import {AccountsReportRequest} from "../../api/model/accountsReportRequest";
import {AccountsReportResponse} from "../../api/model/accountsReportResponse";

describe('ReportEffects', () => {
  let actions$: Actions;
  let effects: ReportEffects;
  let apiService: jasmine.SpyObj<ApiService>;


  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'generateAccountsReport',
    ]);

    TestBed.configureTestingModule({
      providers: [
        ReportEffects,
        provideMockActions(() => actions$),
        {provide: ApiService, useValue: apiServiceSpy},
      ],
    });

    effects = TestBed.inject(ReportEffects);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });
  describe('loadAccountsReport$', () => {
    it('should return generateAccountsReportSuccess on successful load', () => {
      const accountsReportRequest: AccountsReportRequest = {
        userId: '1',
        dateFromUTC: '',
        dateToUTC: ''
      };
      const action = generateAccountsReportAction({accountsReportRequest});
      const accountsReportResponse = {reportDateUTC: ''} as AccountsReportResponse;
      const completion = generateAccountsReportSuccess({accountsReportResponse});

      actions$ = hot('-a-', {a: action});
      const response = cold('-b|', {b: accountsReportResponse});
      apiService.generateAccountsReport.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadAccountsReport$).toBeObservable(expected);
    });

    it('should return generateAccountsReportFailure on error', () => {
      const accountsReportRequest: AccountsReportRequest = {
        userId: '1',
        dateFromUTC: '',
        dateToUTC: ''
      };
      const action = generateAccountsReportAction({accountsReportRequest});
      const errorResponse = new HttpErrorResponse({error: 'Error'});
      const completion = generateAccountsReportFailure({
        errorResponse,
      });

      actions$ = hot('-a-', {a: action});
      const response = cold('-#', {}, errorResponse);
      apiService.generateAccountsReport.and.returnValue(response);

      const expected = cold('--c', {c: completion});
      expect(effects.loadAccountsReport$).toBeObservable(expected);
    });
  });
});

