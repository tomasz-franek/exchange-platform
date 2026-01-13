import type { MockedObject } from 'vitest';
import { vi } from 'vitest';
import { fakeAsync, TestBed } from '@angular/core/testing';
import { ApiService } from '../../services/api.service';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { of, Subject, throwError } from 'rxjs';
import { patchState } from '@ngrx/signals';
import { unprotected } from '@ngrx/signals/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { PropertyStore } from './properties.signal-store';
import { StrategiesService } from './services/strategies.service';
import { UserProperty } from '../api/model/userProperty';
import { Address } from '../api/model/address';
import { SystemCurrency } from '../api/model/systemCurrency';
import { StrategyData } from './services/strategy.data';

describe('PropertyStore', () => {
  let apiService: MockedObject<ApiService>;
  let messageService: MockedObject<MessageService>;
  let translateService: MockedObject<TranslateService>;
  let strategiesService: MockedObject<StrategiesService>;

  beforeEach(async () => {
    const translateServiceSpy = {
      instant: vi.fn().mockName('TranslateService.instant'),
    };
    const apiServiceSpy = {
      loadTimezoneList: vi.fn().mockName('ApiService.loadTimezoneList'),
      updateSystemCurrency: vi.fn().mockName('ApiService.updateSystemCurrency'),
      saveUserProperty: vi.fn().mockName('ApiService.saveUserProperty'),
      loadUnicodeLocalesList: vi
        .fn()
        .mockName('ApiService.loadUnicodeLocalesList'),
      saveUserAddress: vi.fn().mockName('ApiService.saveUserAddress'),
      loadSystemCurrencyList: vi
        .fn()
        .mockName('ApiService.loadSystemCurrencyList'),
      getUserAddress: vi.fn().mockName('ApiService.getUserAddress'),
      getUserProperty: vi.fn().mockName('ApiService.getUserProperty'),
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
  describe('loadTimezoneList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadTimezoneList.mockReturnValue(new Subject<any>());
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        isLoading: false,
      });

      // when
      propertyStore.loadTimezoneList();

      // then
      expect(propertyStore.isLoading()).toBe(true);
    });

    it('should set timezones when backend return data', () => {
      // given
      const timezones: string[] = ['timezone1', 'timezone2'];
      apiService.loadTimezoneList.mockReturnValue(of(timezones) as any);
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        timezones: [],
        isLoading: false,
      });

      // when
      propertyStore.loadTimezoneList();

      // then
      expect(propertyStore.timezones()).toEqual(timezones);
      expect(propertyStore.isLoading()).toBe(false);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.loadTimezoneList.mockReturnValue(
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
      expect(propertyStore.isLoading()).toBe(false);
    }));
  });

  describe('loadUnicodeLocalesList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadUnicodeLocalesList.mockReturnValue(new Subject<any>());
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        isLoading: false,
      });

      // when
      propertyStore.loadUnicodeLocalesList();

      // then
      expect(propertyStore.isLoading()).toBe(true);
    });

    it('should set locales when backend return data', () => {
      // given
      const locales: string[] = ['locale1', 'locale2'];
      apiService.loadUnicodeLocalesList.mockReturnValue(of(locales) as any);
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        locales: [],
        isLoading: false,
      });

      // when
      propertyStore.loadUnicodeLocalesList();

      // then
      expect(propertyStore.locales()).toEqual(locales);
      expect(propertyStore.isLoading()).toBe(false);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.loadUnicodeLocalesList.mockReturnValue(
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
      expect(propertyStore.isLoading()).toBe(false);
    }));
  });

  describe('getUserProperty', () => {
    it('should set isLoading true', () => {
      // given
      apiService.getUserProperty.mockReturnValue(new Subject<any>());
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        isLoading: false,
      });

      // when
      propertyStore.getUserProperty();

      // then
      expect(propertyStore.isLoading()).toBe(true);
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
      apiService.getUserProperty.mockReturnValue(of(userProperty) as any);
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        userProperty: {} as UserProperty,
        isLoading: false,
      });

      // when
      propertyStore.getUserProperty();

      // then
      expect(propertyStore.userProperty()).toEqual(userProperty);
      expect(propertyStore.isLoading()).toBe(false);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.getUserProperty.mockReturnValue(
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
      expect(propertyStore.isLoading()).toBe(false);
    }));
  });

  describe('getUserAddress', () => {
    it('should set isLoading true', () => {
      // given
      apiService.getUserAddress.mockReturnValue(new Subject<any>());
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        isLoading: false,
      });

      // when
      propertyStore.getUserAddress();

      // then
      expect(propertyStore.isLoading()).toBe(true);
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
      apiService.getUserAddress.mockReturnValue(of(userAddress) as any);
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        userAddress: {} as Address,
        isLoading: false,
      });

      // when
      propertyStore.getUserAddress();

      // then
      expect(propertyStore.userAddress()).toEqual(userAddress);
      expect(propertyStore.isLoading()).toBe(false);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.getUserAddress.mockReturnValue(
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
      expect(propertyStore.isLoading()).toBe(false);
    }));
  });

  describe('loadSystemCurrencyList', () => {
    it('should set isLoading true', () => {
      // given
      apiService.loadSystemCurrencyList.mockReturnValue(new Subject<any>());
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        isLoading: false,
      });

      // when
      propertyStore.loadSystemCurrencyList();

      // then
      expect(propertyStore.isLoading()).toBe(true);
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
      apiService.loadSystemCurrencyList.mockReturnValue(
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
      expect(propertyStore.isLoading()).toBe(false);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.loadSystemCurrencyList.mockReturnValue(
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
      expect(propertyStore.isLoading()).toBe(false);
    }));
  });

  describe('loadActuatorStrategyData', () => {
    it('should set isLoading true', () => {
      // given
      strategiesService.loadActuatorStrategyData.mockReturnValue(
        new Subject<any>(),
      );
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        isLoading: false,
      });

      // when
      propertyStore.loadActuatorStrategyData();

      // then
      expect(propertyStore.isLoading()).toBe(true);
    });

    it('should set strategyData when backend return data', () => {
      // given
      const strategyData: StrategyData = {
        feeStrategy: '1',
        ratioStrategy: '2',
        feePercentage: '3',
      };
      strategiesService.loadActuatorStrategyData.mockReturnValue(
        of(strategyData) as any,
      );
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        strategyData: {} as StrategyData,
        isLoading: false,
      });

      // when
      propertyStore.loadActuatorStrategyData();

      // then
      expect(propertyStore.strategyData()).toEqual(strategyData);
      expect(propertyStore.isLoading()).toBe(false);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      strategiesService.loadActuatorStrategyData.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const propertyStore = TestBed.inject(PropertyStore);
      patchState(unprotected(propertyStore), {
        strategyData: { feeStrategy: '3' } as StrategyData,
        isLoading: false,
      });

      // when
      propertyStore.loadActuatorStrategyData();

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'undefinedHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.LOAD');
      expect(propertyStore.strategyData()).toEqual({} as StrategyData);
      expect(propertyStore.isLoading()).toBe(false);
    }));
  });

  describe('saveUserProperty', () => {
    it('should set isLoading true', () => {
      // given
      apiService.saveUserProperty.mockReturnValue(new Subject<any>());
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
      expect(propertyStore.isLoading()).toBe(true);
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
      apiService.saveUserProperty.mockReturnValue(of(userProperty) as any);
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
      expect(propertyStore.isLoading()).toBe(false);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.saveUserProperty.mockReturnValue(
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
      expect(propertyStore.isLoading()).toBe(false);
    }));
  });

  describe('saveUserAddress', () => {
    it('should set isLoading true', () => {
      // given
      apiService.saveUserAddress.mockReturnValue(new Subject<any>());
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
      expect(propertyStore.isLoading()).toBe(true);
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
      apiService.saveUserAddress.mockReturnValue(of(userAddress) as any);
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
      expect(propertyStore.isLoading()).toBe(false);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.saveUserAddress.mockReturnValue(
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
      expect(propertyStore.isLoading()).toBe(false);
    }));
  });

  describe('updateSystemCurrency', () => {
    it('should set isLoading true', () => {
      // given
      apiService.updateSystemCurrency.mockReturnValue(new Subject<any>());
      const propertyStore = TestBed.inject(PropertyStore);
      const request: SystemCurrency = {
        id: 1,
        currency: 'CHF',
        minimumExchange: 2,
      };
      patchState(unprotected(propertyStore), {
        systemCurrencyList: [],
        isLoading: false,
      });
      patchState(unprotected(propertyStore), {
        isLoading: false,
      });

      // when
      propertyStore.updateSystemCurrency(request);

      // then
      expect(propertyStore.isLoading()).toBe(true);
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
      apiService.updateSystemCurrency.mockReturnValue(
        of(systemCurrencies) as any,
      );
      const propertyStore = TestBed.inject(PropertyStore);
      const request: SystemCurrency = {
        id: 1,
        currency: 'CHF',
        minimumExchange: 2,
      };
      patchState(unprotected(propertyStore), {
        systemCurrencyList: [],
        isLoading: false,
      });

      // when
      propertyStore.updateSystemCurrency(request);

      // then
      expect(propertyStore.systemCurrencyList()).toEqual(systemCurrencies);
      expect(propertyStore.isLoading()).toBe(false);
    });

    it('should call messageService.add with error message when backend returns error', fakeAsync(() => {
      // given
      translateService.instant.mockReturnValue('error');
      apiService.updateSystemCurrency.mockReturnValue(
        throwError(() => new HttpErrorResponse({})),
      );
      const propertyStore = TestBed.inject(PropertyStore);
      const request: SystemCurrency = {
        id: 1,
        currency: 'CHF',
        minimumExchange: 2,
      };
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
      propertyStore.updateSystemCurrency(request);

      // then
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        detail:
          'errorHttp failure response for (unknown url): undefined undefined',
      });
      expect(translateService.instant).toHaveBeenCalledWith('ERRORS.SEND');
      expect(propertyStore.systemCurrencyList()).toEqual([]);
      expect(propertyStore.isLoading()).toBe(false);
    }));
  });
});
