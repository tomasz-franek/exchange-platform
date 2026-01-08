import { fakeAsync, TestBed } from '@angular/core/testing';
import { ApiService } from '../../services/api/api.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject, throwError } from 'rxjs';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ReportStore } from './reports.signal-store';
import { FinancialReportRequest } from '../api';

describe('Reports signal store', () => {
  let apiService: jasmine.SpyObj<ApiService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let translateService: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', [
      'instant',
    ]);
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadFinancialReportPdfDocument',
      'loadFinancialReportPdfDocument',
    ]);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    });

    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    messageService = TestBed.inject(
      MessageService,
    ) as jasmine.SpyObj<MessageService>;
    translateService = TestBed.inject(
      TranslateService,
    ) as jasmine.SpyObj<TranslateService>;
  });
  describe('loadFinancialReportPdfDocument', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadFinancialReportPdfDocument.and.returnValue(
        new Subject<any>(),
      );
      const reportStore = TestBed.inject(ReportStore);
      const financialReportRequest = {
        currency: 'EUR',
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
      const financialReportRequest = {
        currency: 'EUR',
        month: 12,
        year: 2024,
        userAccountID: 'userAccountID',
      } as FinancialReportRequest;
      const blobResponse = new Blob([], { type: 'text/plain' });
      apiService.loadFinancialReportPdfDocument.and.returnValue(
        of(blobResponse) as any,
      );
      spyOn(window, 'open');
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
      translateService.instant.and.returnValue('error');
      apiService.loadFinancialReportPdfDocument.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const reportStore = TestBed.inject(ReportStore);
      const financialReportRequest = {
        currency: 'EUR',
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
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
    }));
  });
});
