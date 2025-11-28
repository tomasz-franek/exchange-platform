import {fakeAsync, TestBed} from '@angular/core/testing';
import {MockProvider} from 'ng-mocks';
import {ApiService} from '../../services/api/api.service';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {of, Subject, throwError} from 'rxjs';
import {patchState} from '@ngrx/signals';
import {unprotected} from '@ngrx/signals/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {ReportStore} from './reports.signal-store';
import {FinancialReportRequest} from '../api';

describe('Reports signal store', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ApiService),
        MockProvider(MessageService),
        MockProvider(TranslateService)
      ],
    });
  });
  describe('loadFinancialReportPdfDocument', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadFinancialReportPdfDocument').and.returnValue(new Subject<any>());
      const reportStore = TestBed.inject(ReportStore);
      const financialReportRequest = {
        currency: "EUR",
        month: 12,
        year: 2024,
        userAccountID: 'userAccountID',
      } as FinancialReportRequest;
      patchState(unprotected(reportStore), {
        isLoading: false,
      });

      // when
      reportStore.loadFinancialReportPdfDocument(financialReportRequest);

      // then
      expect(reportStore.isLoading()).toBeTrue();
    });

    it('should show when backend return data', () => {
      // given
      const apiService = TestBed.inject(ApiService);
      const financialReportRequest = {
        currency: "EUR",
        month: 12,
        year: 2024,
        userAccountID: 'userAccountID',
      } as FinancialReportRequest;
      const blobResponse = new Blob([], {type: 'text/plain'});
      spyOn(apiService, 'loadFinancialReportPdfDocument').and.returnValue(of(blobResponse) as any);
      spyOn(window, 'open')
      const reportStore = TestBed.inject(ReportStore);
      patchState(unprotected(reportStore), {
        isLoading: false,
      });

      // when
      reportStore.loadFinancialReportPdfDocument(financialReportRequest);

      // then
      expect(window.open).toHaveBeenCalledTimes(1);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadFinancialReportPdfDocument').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const reportStore = TestBed.inject(ReportStore);
      const financialReportRequest = {
        currency: "EUR",
        month: 12,
        year: 2024,
        userAccountID: 'userAccountID',
      } as FinancialReportRequest;
      patchState(unprotected(reportStore), {
        isLoading: false,
      });

      // when
      reportStore.loadFinancialReportPdfDocument(financialReportRequest);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
    }));
  })
})
