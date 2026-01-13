import type { MockedObject } from 'vitest';
import { vi } from 'vitest';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { ApiService } from '../../services/api.service';
import { StrategiesService } from '../properties/services/strategies.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject, throwError } from 'rxjs';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ReportPairRequest, ReportStore } from './reports.signal-store';
import { AccountsReportRequest } from '../api/model/accountsReportRequest';
import { AccountsReportResponse } from '../api/model/accountsReportResponse';
import { Currency } from '../api/model/currency';
import { ErrorListRequest } from '../api/model/errorListRequest';
import { ErrorMessage } from '../api/model/errorMessage';
import { TransactionsPdfRequest } from '../api/model/transactionsPdfRequest';
import { AccountOperationsRequest } from '../api/model/accountOperationsRequest';
import { PairPeriodResponse } from '../api/model/pairPeriodResponse';

describe('ReportsSignalStore', () => {
  let apiService: MockedObject<ApiService>;
  let messageService: MockedObject<MessageService>;
  let translateService: MockedObject<TranslateService>;
  let strategiesService: MockedObject<StrategiesService>;

  beforeEach(async () => {
    const translateServiceSpy = {
      instant: vi.fn().mockName('TranslateService.instant'),
    };
    const apiServiceSpy = {
      loadTransactionsPdfDocument: vi
        .fn()
        .mockName('ApiService.loadTransactionsPdfDocument'),
      loadOperationPdfDocument: vi
        .fn()
        .mockName('ApiService.loadOperationPdfDocument'),
      generateAccountsReport: vi
        .fn()
        .mockName('ApiService.generateAccountsReport'),
      loadPairPeriodReport: vi.fn().mockName('ApiService.loadPairPeriodReport'),
      loadErrorList: vi.fn().mockName('ApiService.loadErrorList'),
      deleteError: vi.fn().mockName('ApiService.deleteError'),
    };
    const messageServiceSpy = {
      add: vi.fn().mockName('MessageService.add'),
    };
    const strategiesServiceSpy = {
      loadActuatorStrategyData: vi
        .fn()
        .mockName('StrategiesService.loadActuatorStrategyData'),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: StrategiesService, useValue: strategiesServiceSpy },
      ],
    });
    apiService = TestBed.inject(ApiService) as MockedObject<ApiService>;
    messageService = TestBed.inject(
      MessageService,
    ) as MockedObject<MessageService>;
    translateService = TestBed.inject(
      TranslateService,
    ) as MockedObject<TranslateService>;
    strategiesService = TestBed.inject(
      StrategiesService,
    ) as MockedObject<StrategiesService>;
  });

  describe('generateAccountsReport', () => {
    it('should set isLoading true', () => {
      // given
      apiService.generateAccountsReport.mockReturnValue(new Subject<any>());
      const reportStore = TestBed.inject(ReportStore);
      const request = {} as AccountsReportRequest;
      patchState(unprotected(reportStore), {
        isLoading: false,
      });

      // when
      reportStore.generateAccountsReport(request);

      // then
      expect(reportStore.isLoading()).toBe(true);
    });

    it('should set errorMessageList when backend return data', () => {
      // given
      const accountResponse: AccountsReportResponse[] = [
        {
          currency: Currency.Chf,
          amountCancellations: 2,
          amountCorrections: 4,
          amountDeposits: 4,
          amountExchanges: 5,
          amountFees: 4,
          amountWithdraws: 2,
          reportDateUtc: 'reportDateUtc',
        },
      ];
      apiService.generateAccountsReport.mockReturnValue(
        of(accountResponse) as any,
      );
      const reportStore = TestBed.inject(ReportStore);
      const request = {} as AccountsReportRequest;
      patchState(unprotected(reportStore), {
        accountsReportResponse: [],
        isLoading: false,
      });

      // when
      reportStore.generateAccountsReport(request);

      // then
      expect(reportStore.accountsReportResponse()).toEqual(accountResponse);
      expect(reportStore.isLoading()).toBe(false);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.generateAccountsReport.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const reportStore = TestBed.inject(ReportStore);
      const request = {
        userId: 'userId',
        dateFromUtc: 'dateFromUtc',
        dateToUtc: 'dateToUtc',
      } as AccountsReportRequest;
      patchState(unprotected(reportStore), {
        accountsReportResponse: [
          {
            currency: 'CHF',
          },
        ],
        isLoading: false,
      });

      // when
      reportStore.generateAccountsReport(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(reportStore.accountsReportResponse()).toEqual([]);
      expect(reportStore.isLoading()).toBe(false);
    }));
  });

  describe('loadErrorList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadErrorList.mockReturnValue(new Subject<any>());
      const propertyStore = TestBed.inject(ReportStore);
      const request = {
        offset: 1,
      } as ErrorListRequest;
      patchState(unprotected(propertyStore), {
        isLoading: false,
      });

      // when
      propertyStore.loadErrorList(request);

      // then
      expect(propertyStore.isLoading()).toBe(true);
    });

    it('should set errorMessageList when backend return data', () => {
      // given
      const errorMessageList: ErrorMessage[] = [
        {
          id: '1',
          message: 'message',
          offset: 2,
          timestamp: 2,
        },
        {
          id: '2',
          message: 'message',
          offset: 2,
          timestamp: 2,
        },
      ];
      apiService.loadErrorList.mockReturnValue(of(errorMessageList) as any);
      const propertyStore = TestBed.inject(ReportStore);
      const request = {
        offset: 1,
      } as ErrorListRequest;
      patchState(unprotected(propertyStore), {
        errorMessageList: [],
        isLoading: false,
      });

      // when
      propertyStore.loadErrorList(request);

      // then
      expect(propertyStore.errorMessageList()).toEqual(errorMessageList);
      expect(propertyStore.isLoading()).toBe(false);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.loadErrorList.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const propertyStore = TestBed.inject(ReportStore);
      const request = {
        offset: 1,
      } as ErrorListRequest;
      patchState(unprotected(propertyStore), {
        errorMessageList: [{ id: '2' } as ErrorMessage],
        isLoading: false,
      });

      // when
      propertyStore.loadErrorList(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(propertyStore.errorMessageList()).toEqual([]);
      expect(propertyStore.isLoading()).toBe(false);
    }));
  });

  describe('deleteError', () => {
    it('should set isLoading true', () => {
      // given
      apiService.deleteError.mockReturnValue(new Subject<any>());
      const propertyStore = TestBed.inject(ReportStore);
      // when
      propertyStore.deleteError(1);

      // then
      expect(propertyStore.isLoading()).toBe(true);
    });

    it('should set errorMessageList when backend return data', () => {
      // given
      const errorMessageList: ErrorMessage[] = [
        {
          id: '1',
          message: 'message',
          offset: 2,
          timestamp: 2,
        },
        {
          id: '2',
          message: 'message',
          offset: 2,
          timestamp: 2,
        },
      ];
      apiService.deleteError.mockReturnValue(of(errorMessageList) as any);
      const propertyStore = TestBed.inject(ReportStore);
      patchState(unprotected(propertyStore), {
        errorMessageList: [],
        isLoading: false,
      });

      // when
      propertyStore.deleteError(1);

      // then
      expect(propertyStore.errorMessageList()).toEqual(errorMessageList);
      expect(propertyStore.isLoading()).toBe(false);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.deleteError.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const propertyStore = TestBed.inject(ReportStore);
      patchState(unprotected(propertyStore), {
        errorMessageList: [{ id: '2' } as ErrorMessage],
        isLoading: false,
      });

      // when
      propertyStore.deleteError(1);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(propertyStore.errorMessageList()).toEqual([]);
      expect(propertyStore.isLoading()).toBe(false);
    }));
  });

  describe('loadTransactionsPdfDocument', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadTransactionsPdfDocument.mockReturnValue(
        new Subject<any>(),
      );
      const reportStore = TestBed.inject(ReportStore);
      const request = {
        currency: 'EUR',
        dateFromUtc: 'dateFromUtc',
        dateToUtc: 'dateToUtc',
      } as TransactionsPdfRequest;
      patchState(unprotected(reportStore), {
        isLoading: false,
      });

      // when
      reportStore.loadTransactionsPdfDocument(request);

      // then
      expect(reportStore.isLoading()).toBe(true);
    });

    it('should show when backend return data', () => {
      // given
      const request = {
        currency: 'EUR',
        dateFromUtc: 'dateFromUtc',
        dateToUtc: 'dateToUtc',
      } as TransactionsPdfRequest;
      const blobResponse = new Blob([], { type: 'text/plain' });
      apiService.loadTransactionsPdfDocument.mockReturnValue(
        of(blobResponse) as any,
      );
      vi.spyOn(window, 'open');
      const reportStore = TestBed.inject(ReportStore);
      patchState(unprotected(reportStore), {
        isLoading: false,
      });

      // when
      reportStore.loadTransactionsPdfDocument(request);

      // then
      expect(window.open).toHaveBeenCalledTimes(1);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.loadTransactionsPdfDocument.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const reportStore = TestBed.inject(ReportStore);
      const request = {
        currency: 'EUR',
        dateFromUtc: 'dateFromUtc',
        dateToUtc: 'dateToUtc',
      } as TransactionsPdfRequest;
      patchState(unprotected(reportStore), {
        isLoading: false,
      });

      // when
      reportStore.loadTransactionsPdfDocument(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
    }));
  });

  describe('loadOperationPdfDocument', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadOperationPdfDocument.mockReturnValue(new Subject<any>());
      const reportStore = TestBed.inject(ReportStore);
      const request = {
        systemAccountId: 'systemAccountId',
        dateFromUtc: 'dateFromUtc',
        dateToUtc: 'dateToUtc',
      } as AccountOperationsRequest;
      patchState(unprotected(reportStore), {
        isLoading: false,
      });

      // when
      reportStore.loadOperationPdfDocument(request);

      // then
      expect(reportStore.isLoading()).toBe(true);
    });

    it('should show when backend return data', () => {
      // given
      const request = {
        systemAccountId: 'systemAccountId',
        dateFromUtc: 'dateFromUtc',
        dateToUtc: 'dateToUtc',
      } as AccountOperationsRequest;
      const blobResponse = new Blob([], { type: 'text/plain' });
      apiService.loadOperationPdfDocument.mockReturnValue(
        of(blobResponse) as any,
      );
      vi.spyOn(window, 'open');
      const reportStore = TestBed.inject(ReportStore);
      patchState(unprotected(reportStore), {
        isLoading: false,
      });

      // when
      reportStore.loadOperationPdfDocument(request);

      // then
      expect(window.open).toHaveBeenCalledTimes(1);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.loadOperationPdfDocument.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const reportStore = TestBed.inject(ReportStore);
      const request = {
        systemAccountId: 'systemAccountId',
        dateFromUtc: 'dateFromUtc',
        dateToUtc: 'dateToUtc',
      } as AccountOperationsRequest;
      patchState(unprotected(reportStore), {
        isLoading: false,
      });

      // when
      reportStore.loadOperationPdfDocument(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
    }));
  });

  describe('loadPairPeriodReport', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadPairPeriodReport.mockReturnValue(new Subject<any>());
      const propertyStore = TestBed.inject(ReportStore);
      const request = {
        pair: 'EUR_GBP',
        period: 12,
      } as ReportPairRequest;
      patchState(unprotected(propertyStore), {
        isLoading: false,
      });

      // when
      propertyStore.loadPairPeriodReport(request);

      // then
      expect(propertyStore.isLoading()).toBe(true);
    });

    it('should set errorMessageList when backend return data', () => {
      // given
      const response = {
        maximumRatio: 99,
        currentRatio: 98,
        minimumRatio: 97,
      } as PairPeriodResponse;
      apiService.loadPairPeriodReport.mockReturnValue(of(response) as any);
      const propertyStore = TestBed.inject(ReportStore);
      const request = {
        pair: 'EUR_GBP',
        period: 12,
      } as ReportPairRequest;
      patchState(unprotected(propertyStore), {
        pairPeriodResponse: {
          maximumRatio: 1,
          currentRatio: 2,
          minimumRatio: 2,
        } as PairPeriodResponse,
        isLoading: false,
      });

      // when
      propertyStore.loadPairPeriodReport(request);

      // then
      expect(propertyStore.pairPeriodResponse()).toEqual(response);
      expect(propertyStore.isLoading()).toBe(false);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.loadPairPeriodReport.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const propertyStore = TestBed.inject(ReportStore);
      const request = {
        pair: 'EUR_GBP',
        period: 12,
      } as ReportPairRequest;
      patchState(unprotected(propertyStore), {
        pairPeriodResponse: { maximumRatio: 2 } as PairPeriodResponse,
        isLoading: false,
      });

      // when
      propertyStore.loadPairPeriodReport(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(propertyStore.pairPeriodResponse()).toEqual(
        {} as PairPeriodResponse,
      );
      expect(propertyStore.isLoading()).toBe(false);
    }));
  });
});
