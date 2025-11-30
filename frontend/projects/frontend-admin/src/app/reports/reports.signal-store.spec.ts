import {fakeAsync, TestBed} from '@angular/core/testing';
import {MockProvider} from 'ng-mocks';
import {ApiService} from '../../services/api.service';
import {StrategiesService} from '../properties/services/strategies.service';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {of, Subject, throwError} from 'rxjs';
import {patchState} from '@ngrx/signals';
import {unprotected} from '@ngrx/signals/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {ReportStore} from './reports.signal-store';
import {AccountsReportRequest} from '../api/model/accountsReportRequest';
import {AccountsReportResponse} from '../api/model/accountsReportResponse';
import {Currency} from '../api/model/currency';
import {ErrorListRequest} from '../api/model/errorListRequest';
import {ErrorMessage} from '../api/model/errorMessage';


describe('ReportsSignalStore', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ApiService),
        MockProvider(StrategiesService),
        MockProvider(MessageService),
        MockProvider(TranslateService)
      ],
    });
  });

  describe('generateAccountsReport', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'generateAccountsReport').and.returnValue(new Subject<any>());
      const reportStore = TestBed.inject(ReportStore);
      const request = {} as AccountsReportRequest;
      patchState(unprotected(reportStore), {
        isLoading: false,
      });

      // when
      reportStore.generateAccountsReport(request);

      // then
      expect(reportStore.isLoading()).toBeTrue();
    });

    it('should set errorMessageList when backend return data', () => {
      // given
      const apiService = TestBed.inject(ApiService);
      const accountResponse: AccountsReportResponse[] = [{
        currency: Currency.Chf,
        amountCancellations: 2,
        amountCorrections: 4,
        amountDeposits: 4,
        amountExchanges: 5, amountFees: 4,
        amountWithdraws: 2,
        reportDateUtc: 'reportDateUtc',
      }];
      spyOn(apiService, 'generateAccountsReport').and.returnValue(of(accountResponse) as any);
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
      expect(reportStore.isLoading()).toBeFalse();
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'generateAccountsReport').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const reportStore = TestBed.inject(ReportStore);
      const request = {
        userId: 'userId',
        dateFromUtc: 'dateFromUtc',
        dateToUtc: 'dateToUtc'
      } as AccountsReportRequest;
      patchState(unprotected(reportStore), {
        accountsReportResponse: [{
          currency: 'CHF'
        }],
        isLoading: false,
      });

      // when
      reportStore.generateAccountsReport(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(reportStore.accountsReportResponse()).toEqual([]);
      expect(reportStore.isLoading()).toBeFalse();
    }));
  })


  describe('loadErrorList', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadErrorList').and.returnValue(new Subject<any>());
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
      expect(propertyStore.isLoading()).toBeTrue();
    });

    it('should set errorMessageList when backend return data', () => {
      // given
      const apiService = TestBed.inject(ApiService);
      const errorMessageList: ErrorMessage[] = [{
        id: '1',
        message: 'message',
        offset: 2,
        timestamp: 2
      }, {
        id: '2',
        message: 'message',
        offset: 2,
        timestamp: 2
      }];
      spyOn(apiService, 'loadErrorList').and.returnValue(of(errorMessageList) as any);
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
      expect(propertyStore.isLoading()).toBeFalse();
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadErrorList').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const propertyStore = TestBed.inject(ReportStore);
      const request = {
        offset: 1,
      } as ErrorListRequest;
      patchState(unprotected(propertyStore), {
        errorMessageList: [{id: '2'} as ErrorMessage],
        isLoading: false,
      });

      // when
      propertyStore.loadErrorList(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(propertyStore.errorMessageList()).toEqual([]);
      expect(propertyStore.isLoading()).toBeFalse();
    }));
  })

  describe('deleteError', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'deleteError').and.returnValue(new Subject<any>());
      const propertyStore = TestBed.inject(ReportStore);
      // when
      propertyStore.deleteError(1);

      // then
      expect(propertyStore.isLoading()).toBeTrue();
    });

    it('should set errorMessageList when backend return data', () => {
      // given
      const apiService = TestBed.inject(ApiService);
      const errorMessageList: ErrorMessage[] = [{
        id: '1',
        message: 'message',
        offset: 2,
        timestamp: 2
      }, {
        id: '2',
        message: 'message',
        offset: 2,
        timestamp: 2
      }];
      spyOn(apiService, 'deleteError').and.returnValue(of(errorMessageList) as any);
      const propertyStore = TestBed.inject(ReportStore);
      patchState(unprotected(propertyStore), {
        errorMessageList: [],
        isLoading: false,
      });

      // when
      propertyStore.deleteError(1);

      // then
      expect(propertyStore.errorMessageList()).toEqual(errorMessageList);
      expect(propertyStore.isLoading()).toBeFalse();
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'deleteError').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const propertyStore = TestBed.inject(ReportStore);
      patchState(unprotected(propertyStore), {
        errorMessageList: [{id: '2'} as ErrorMessage],
        isLoading: false,
      });

      // when
      propertyStore.deleteError(1);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(propertyStore.errorMessageList()).toEqual([]);
      expect(propertyStore.isLoading()).toBeFalse();
    }));
  })
})
