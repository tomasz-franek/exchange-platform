import {fakeAsync, TestBed} from '@angular/core/testing';
import {MockProvider} from 'ng-mocks';
import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {of, Subject, throwError} from 'rxjs';
import {patchState} from '@ngrx/signals';
import {unprotected} from '@ngrx/signals/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {ApiService} from '../../services/api/api.service';
import {RatesStore} from './rates.signal-store';
import {CurrencyRate} from '../api/model/currencyRate';

describe('RatesSignalStore', () => {
  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        MockProvider(ApiService),
        MockProvider(MessageService),
        MockProvider(TranslateService)
      ],
    });
  });

  describe('loadCurrencyRates', () => {
    it('should set isLoading true', () => {
      // given
      const service = TestBed.inject(ApiService);
      spyOn(service, 'loadCurrencyRates').and.returnValue(new Subject<any>());
      const ratesStore = TestBed.inject(RatesStore);
      patchState(unprotected(ratesStore), {
        isLoading: false,
      });

      // when
      ratesStore.loadCurrencyRates();

      // then
      expect(ratesStore.isLoading()).toBeTrue();
    });

    it('should set currencyRate when backend return data', () => {
      // given
      const apiService = TestBed.inject(ApiService);
      const currencyRates: CurrencyRate[] = [{
        sellRate: 1,
        buyRate: 2,
        sellAmount: 3,
        buyAmount: 6,
        pair: "GBP_CHF"
      }, {
        sellRate: 9,
        buyRate: 8,
        sellAmount: 6,
        buyAmount: 2,
        pair: "EUR_USD"
      }];
      spyOn(apiService, 'loadCurrencyRates').and.returnValue(of(currencyRates) as any);
      const ratesStore = TestBed.inject(RatesStore);
      patchState(unprotected(ratesStore), {
        currencyRates: [] as CurrencyRate[],
        isLoading: false,
      });

      // when
      ratesStore.loadCurrencyRates();

      // then
      expect(ratesStore.currencyRates()).toEqual(currencyRates);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      const translateService = TestBed.inject(TranslateService);
      spyOn(translateService, 'instant').and.returnValue('error');
      const messageService = TestBed.inject(MessageService);
      spyOn(messageService, 'add');
      const apiService = TestBed.inject(ApiService);
      spyOn(apiService, 'loadCurrencyRates').and.returnValue(
        throwError(() => new HttpErrorResponse({}))
      );
      const ratesStore = TestBed.inject(RatesStore);
      patchState(unprotected(ratesStore), {
        currencyRates: [] as CurrencyRate[],
        isLoading: false,
      });

      // when
      ratesStore.loadCurrencyRates();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail: 'errorHttp failure response for (unknown url): undefined undefined'
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
    }));
  })
})
