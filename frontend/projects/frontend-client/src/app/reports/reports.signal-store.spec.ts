import type { MockedObject } from 'vitest';
import { beforeEach, describe, expect, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
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
  let apiService: MockedObject<ApiService>;
  let messageService: MockedObject<MessageService>;
  let translateService: MockedObject<TranslateService>;

  beforeEach(async () => {
    const translateServiceSpy = {
      instant: vi.fn().mockName('TranslateService.instant'),
    };
    const apiServiceSpy = {
      loadFinancialReportPdfDocument: vi
        .fn()
        .mockName('ApiService.loadFinancialReportPdfDocument'),
    };
    const messageServiceSpy = {
      add: vi.fn().mockName('MessageService.add'),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    });

    apiService = TestBed.inject(ApiService) as MockedObject<ApiService>;
    messageService = TestBed.inject(
      MessageService,
    ) as MockedObject<MessageService>;
    translateService = TestBed.inject(
      TranslateService,
    ) as MockedObject<TranslateService>;
  });
  describe('loadFinancialReportPdfDocument', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadFinancialReportPdfDocument.mockReturnValue(
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
      expect(reportStore.isLoading()).toBe(true);
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
      apiService.loadFinancialReportPdfDocument.mockReturnValue(
        of(blobResponse) as any,
      );
      const spy = vi.spyOn(window, 'open').mockReturnValue(null);
      const reportStore = TestBed.inject(ReportStore);
      patchState(unprotected(reportStore), {
        isLoading: false,
      });

      // when
      reportStore.loadFinancialReportPdfDocument(financialReportRequest);

      // then
      expect(window.open).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });

    it('should call messageService.add with error message when backend returns error', () => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.loadFinancialReportPdfDocument.mockReturnValue(
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
    });
  });
});
