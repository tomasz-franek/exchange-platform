import {fakeAsync, TestBed} from '@angular/core/testing';

import {MessageService} from 'primeng/api';
import {TranslateService} from '@ngx-translate/core';
import {of, Subject, throwError} from 'rxjs';
import {patchState} from '@ngrx/signals';
import {unprotected} from '@ngrx/signals/testing';
import {HttpErrorResponse} from '@angular/common/http';
import {PropertyStore} from './properties.signal-store';
import {UserProperty} from '../api/model/userProperty';
import {Address} from '../api/model/address';
import {SystemCurrency} from '../api/model/systemCurrency';
import {ApiService} from '../../services/api/api.service';

describe('PropertyStore', () => {
  let apiService: jasmine.SpyObj<ApiService>;
  let messageService: jasmine.SpyObj<MessageService>;
  let translateService: jasmine.SpyObj<TranslateService>;

  beforeEach(async () => {
    const translateServiceSpy = jasmine.createSpyObj('TranslateService', [
      'instant',
    ]);
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadTimezoneList',
      'loadSystemCurrencyList',
      'getUserProperty',
      'saveUserProperty',
      'saveUserAddress',
      'getUserAddress',
      'loadUnicodeLocalesList',
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
  describe('loadTimezoneList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadTimezoneList.and.returnValue(new Subject<any>());
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        isLoading: false,
      });

      // when
      propertyStore.loadTimezoneList();

      // then
      expect(propertyStore.isLoading()).toBeTrue();
    });

    it('should set timezones when backend return data', () => {
      // given
      const timezones: string[] = ['timezone1', 'timezone2'];
      apiService.loadTimezoneList.and.returnValue(of(timezones) as any);
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        timezones: [],
        isLoading: false,
      });

      // when
      propertyStore.loadTimezoneList();

      // then
      expect(propertyStore.timezones()).toEqual(timezones);
      expect(propertyStore.isLoading()).toBeFalse();
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.loadTimezoneList.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        timezones: ['timezone1', 'timezone2'],
        isLoading: false,
      });

      // when
      propertyStore.loadTimezoneList();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(propertyStore.timezones()).toEqual([]);
      expect(propertyStore.isLoading()).toBeFalse();
    }));
  });

  describe('loadUnicodeLocalesList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadUnicodeLocalesList.and.returnValue(new Subject<any>());
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        isLoading: false,
      });

      // when
      propertyStore.loadUnicodeLocalesList();

      // then
      expect(propertyStore.isLoading()).toBeTrue();
    });

    it('should set locales when backend return data', () => {
      // given
      const locales: string[] = ['locale1', 'locale2'];
      apiService.loadUnicodeLocalesList.and.returnValue(of(locales) as any);
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        locales: [],
        isLoading: false,
      });

      // when
      propertyStore.loadUnicodeLocalesList();

      // then
      expect(propertyStore.locales()).toEqual(locales);
      expect(propertyStore.isLoading()).toBeFalse();
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.loadUnicodeLocalesList.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        locales: ['timezone1', 'timezone2'],
        isLoading: false,
      });

      // when
      propertyStore.loadUnicodeLocalesList();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(propertyStore.locales()).toEqual([]);
      expect(propertyStore.isLoading()).toBeFalse();
    }));
  });

  describe('getUserProperty', () => {
    it('should set isLoading true', () => {
      // given
      apiService.getUserProperty.and.returnValue(new Subject<any>());
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        isLoading: false,
      });

      // when
      propertyStore.getUserProperty();

      // then
      expect(propertyStore.isLoading()).toBeTrue();
    });

    it('should set userProperty when backend return data', () => {
      // given
      const userProperty: UserProperty = {
        userId: 'userId',
        language: 'language',
        locale: 'locale',
        version: 2,
        timezone: 'timezone1',
      };
      apiService.getUserProperty.and.returnValue(of(userProperty) as any);
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        userProperty: {} as UserProperty,
        isLoading: false,
      });

      // when
      propertyStore.getUserProperty();

      // then
      expect(propertyStore.userProperty()).toEqual(userProperty);
      expect(propertyStore.isLoading()).toBeFalse();
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.getUserProperty.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        userProperty: { userId: 'userId' } as UserProperty,
        isLoading: false,
      });

      // when
      propertyStore.getUserProperty();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(propertyStore.userProperty()).toEqual({} as UserProperty);
      expect(propertyStore.isLoading()).toBeFalse();
    }));
  });

  describe('getUserAddress', () => {
    it('should set isLoading true', () => {
      // given
      apiService.getUserAddress.and.returnValue(new Subject<any>());
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        isLoading: false,
      });

      // when
      propertyStore.getUserAddress();

      // then
      expect(propertyStore.isLoading()).toBeTrue();
    });

    it('should set userAddress when backend return data', () => {
      // given
      const userAddress: Address = {
        userId: 'userId',
        name: 'name',
        city: 'city',
        version: 2,
        countryCode: 'countryCode',
      };
      apiService.getUserAddress.and.returnValue(of(userAddress) as any);
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        userAddress: {} as Address,
        isLoading: false,
      });

      // when
      propertyStore.getUserAddress();

      // then
      expect(propertyStore.userAddress()).toEqual(userAddress);
      expect(propertyStore.isLoading()).toBeFalse();
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.getUserAddress.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        userAddress: { userId: 'userId' } as Address,
        isLoading: false,
      });

      // when
      propertyStore.getUserAddress();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(propertyStore.userAddress()).toEqual({} as Address);
      expect(propertyStore.isLoading()).toBeFalse();
    }));
  });

  describe('loadSystemCurrencyList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadSystemCurrencyList.and.returnValue(new Subject<any>());
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        isLoading: false,
      });

      // when
      propertyStore.loadSystemCurrencyList();

      // then
      expect(propertyStore.isLoading()).toBeTrue();
    });

    it('should set systemCurrencyList when backend return data', () => {
      // given
      const systemCurrencies: SystemCurrency[] = [
        {
          id: 1,
          currency: 'CHF',
          minimumExchange: 2,
        },
        {
          id: 2,
          currency: 'PLN',
          minimumExchange: 2,
        },
      ];
      apiService.loadSystemCurrencyList.and.returnValue(
        of(systemCurrencies) as any,
      );
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        systemCurrencyList: [],
        isLoading: false,
      });

      // when
      propertyStore.loadSystemCurrencyList();

      // then
      expect(propertyStore.systemCurrencyList()).toEqual(systemCurrencies);
      expect(propertyStore.isLoading()).toBeFalse();
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.loadSystemCurrencyList.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        systemCurrencyList: [
          {
            id: 1,
            currency: 'CHF',
            minimumExchange: 2,
          },
        ],
        isLoading: false,
      });

      // when
      propertyStore.loadSystemCurrencyList();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(propertyStore.systemCurrencyList()).toEqual([]);
      expect(propertyStore.isLoading()).toBeFalse();
    }));
  });

  describe('saveUserProperty', () => {
    it('should set isLoading true', () => {
      // given
      apiService.saveUserProperty.and.returnValue(new Subject<any>());
      const propertyStore = TestBed.inject(PropertyStore);
      const request: UserProperty = {
        userId: 'userId-new',
        language: 'language',
        locale: 'locale',
        version: 2,
        timezone: 'timezone1',
      };
      patchState(unprotected(propertyStore), {
        isLoading: false,
      });

      // when
      propertyStore.saveUserProperty(request);

      // then
      expect(propertyStore.isLoading()).toBeTrue();
    });

    it('should set userProperty when backend return data', () => {
      // given
      const userProperty: UserProperty = {
        userId: 'userId-saved',
        language: 'language',
        locale: 'locale',
        version: 2,
        timezone: 'timezone1',
      };
      apiService.saveUserProperty.and.returnValue(of(userProperty) as any);
      const propertyStore = TestBed.inject(PropertyStore);
      const request: UserProperty = {
        userId: 'userId-new',
        language: 'language',
        locale: 'locale',
        version: 2,
        timezone: 'timezone1',
      };
      patchState(unprotected(propertyStore), {
        userProperty: {} as UserProperty,
        isLoading: false,
      });

      // when
      propertyStore.saveUserProperty(request);

      // then
      expect(propertyStore.userProperty()).toEqual(userProperty);
      expect(propertyStore.isLoading()).toBeFalse();
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.saveUserProperty.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const propertyStore = TestBed.inject(PropertyStore);
      const request: UserProperty = {
        userId: 'userId-new',
        language: 'language',
        locale: 'locale',
        version: 2,
        timezone: 'timezone1',
      };
      patchState(unprotected(propertyStore), {
        userProperty: { userId: 'userId' } as UserProperty,
        isLoading: false,
      });

      // when
      propertyStore.saveUserProperty(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(propertyStore.userProperty()).toEqual({
        userId: 'userId',
      } as UserProperty);
      expect(propertyStore.isLoading()).toBeFalse();
    }));
  });

  describe('saveUserAddress', () => {
    it('should set isLoading true', () => {
      // given
      apiService.saveUserAddress.and.returnValue(new Subject<any>());
      const propertyStore = TestBed.inject(PropertyStore);
      const request: Address = {
        userId: 'userId',
        name: 'name',
        city: 'city',
        version: 2,
        countryCode: 'countryCode',
      };
      patchState(unprotected(propertyStore), {
        isLoading: false,
      });

      // when
      propertyStore.saveUserAddress(request);

      // then
      expect(propertyStore.isLoading()).toBeTrue();
    });

    it('should set userAddress when backend return data', () => {
      // given
      const userAddress: Address = {
        userId: 'userId',
        name: 'name',
        city: 'city',
        version: 2,
        countryCode: 'countryCode',
      };
      apiService.saveUserAddress.and.returnValue(of(userAddress) as any);
      const propertyStore = TestBed.inject(PropertyStore);
      const request: Address = {
        userId: 'userId',
        name: 'name',
        city: 'city',
        version: 2,
        countryCode: 'countryCode',
      };
      patchState(unprotected(propertyStore), {
        userAddress: {} as Address,
        isLoading: false,
      });

      // when
      propertyStore.saveUserAddress(request);

      // then
      expect(propertyStore.userAddress()).toEqual(userAddress);
      expect(propertyStore.isLoading()).toBeFalse();
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.and.returnValue('error');
      apiService.saveUserAddress.and.returnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const propertyStore = TestBed.inject(PropertyStore);
      const request: Address = {
        userId: 'userId',
        name: 'name',
        city: 'city',
        version: 2,
        countryCode: 'countryCode',
      };
      patchState(unprotected(propertyStore), {
        userAddress: { userId: 'userId' } as Address,
        isLoading: false,
      });

      // when
      propertyStore.saveUserAddress(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(propertyStore.userAddress()).toEqual({
        userId: 'userId',
      } as Address);
      expect(propertyStore.isLoading()).toBeFalse();
    }));
  });
});
