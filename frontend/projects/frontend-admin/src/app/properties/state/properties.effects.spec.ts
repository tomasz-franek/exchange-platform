import {TestBed} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {Actions} from '@ngrx/effects';
import {of, throwError} from 'rxjs';

import {HttpErrorResponse} from '@angular/common/http';
import {
  getUserAddressAction,
  getUserAddressFailure,
  getUserAddressSuccess,
  getUserPropertyAction,
  getUserPropertyFailure,
  getUserPropertySuccess,
  loadLocaleListAction,
  loadLocaleListFailure,
  loadLocaleListSuccess,
  loadStrategyDataAction,
  loadStrategyDataFailure,
  loadStrategyDataSuccess,
  loadSystemCurrencyListAction,
  loadSystemCurrencyListFailure,
  loadSystemCurrencyListSuccess,
  loadTimezoneListAction,
  loadTimezoneListFailure,
  loadTimezoneListSuccess,
  saveUserAddressAction,
  saveUserAddressFailure,
  saveUserAddressSuccess,
  saveUserPropertyAction,
  saveUserPropertyFailure,
  saveUserPropertySuccess,
  updateSystemCurrencyAction,
  updateSystemCurrencyFailure,
  updateSystemCurrencySuccess,
} from './properties.actions';
import {PropertiesEffects} from './properties.effects';
import {ApiService} from '../../../services/api.service';
import {UserProperty} from '../../api/model/userProperty';
import {Address} from '../../api/model/address';
import {StrategiesService} from '../services/strategies.service';
import {StrategyData} from '../services/strategy.data';
import {SystemCurrency} from '../../api/model/systemCurrency';

describe('PropertiesEffects', () => {
  let effects: PropertiesEffects;
  let actions$: Actions;
  let apiService: jasmine.SpyObj<ApiService>;
  let strategiesService: jasmine.SpyObj<StrategiesService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadTimezoneList',
      'loadUnicodeLocalesList',
      'getUserProperty',
      'saveUserProperty',
      'getUserAddress',
      'saveUserAddress',
      'loadSystemProperties',
      'loadSystemCurrencyList',
      'updateSystemCurrency'
    ]);

    const apiStrategiesSpy = jasmine.createSpyObj('StrategiesService', [
      'loadActuatorStrategyData',
    ]);

    TestBed.configureTestingModule({
      providers: [
        PropertiesEffects,
        provideMockActions(() => actions$),
        {provide: ApiService, useValue: apiServiceSpy},
        {provide: StrategiesService, useValue: apiStrategiesSpy},
      ],
    });

    effects = TestBed.inject(PropertiesEffects);
    actions$ = TestBed.inject(Actions);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    strategiesService = TestBed.inject(
      StrategiesService,
    ) as jasmine.SpyObj<StrategiesService>;
  });

  describe('loadTimezones$', () => {
    it('should return a LoadTimezoneListSuccess action, with timezones, on success', () => {
      const timezones = ['UTC', 'GMT'];
      const action = loadTimezoneListAction();
      const outcome = loadTimezoneListSuccess({timezones});

      actions$ = of(action);
      apiService.loadTimezoneList.and.returnValue(of(timezones));

      effects.loadTimezones$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });

    it('should return a LoadTimezoneListFailure action, on error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Not Found',
        status: 404,
      });
      const action = loadTimezoneListAction();
      const outcome = loadTimezoneListFailure({errorResponse});

      actions$ = of(action);
      apiService.loadTimezoneList.and.returnValue(
        throwError(() => errorResponse),
      );

      effects.loadTimezones$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });
  });

  describe('loadLocales$', () => {
    it('should return a LoadLocaleListSuccess action, with locales, on success', () => {
      const locales = ['English', 'Polish'];
      const action = loadLocaleListAction();
      const outcome = loadLocaleListSuccess({locales});

      actions$ = of(action);
      apiService.loadUnicodeLocalesList.and.returnValue(of(locales));

      effects.loadLocales$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });

    it('should return a LoadLocaleListFailure action, on error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = loadLocaleListAction();
      const outcome = loadLocaleListFailure({errorResponse});

      actions$ = of(action);
      apiService.loadUnicodeLocalesList.and.returnValue(
        throwError(() => errorResponse),
      );

      effects.loadLocales$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });
  });

  describe('getUserProperty$', () => {
    it('should return a LoadLocaleListSuccess action, with locales, on success', () => {
      const userProperty: UserProperty = {
        userId: 'userId',
        locale: 'locale',
        version: 2,
        timezone: 'timezone',
        language: 'en-US',
      };
      const action = getUserPropertyAction();
      const outcome = getUserPropertySuccess({userProperty});

      actions$ = of(action);
      apiService.getUserProperty.and.returnValue(of(userProperty));

      effects.getUserProperty$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });

    it('should return a LoadLocaleListFailure action, on error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = getUserPropertyAction();
      const outcome = getUserPropertyFailure({errorResponse});

      actions$ = of(action);
      apiService.getUserProperty.and.returnValue(
        throwError(() => errorResponse),
      );

      effects.getUserProperty$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });
  });

  describe('saveUserProperty$', () => {
    it('should return a saveUserPropertySuccess action, with locales, on success', () => {
      const userProperty: UserProperty = {
        userId: 'userId',
        locale: 'locale',
        version: 2,
        timezone: 'timezone',
        language: 'en-US',
      };
      const action = saveUserPropertyAction({userProperty});
      const outcome = saveUserPropertySuccess();

      actions$ = of(action);
      apiService.saveUserProperty.and.returnValue(of(userProperty));

      effects.saveUserProperty$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });

    it('should return a saveUserPropertyFailure action, on error', () => {
      const userProperty: UserProperty = {
        userId: 'userId',
        locale: 'locale',
        version: 2,
        timezone: 'timezone',
        language: 'en-US',
      };
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = saveUserPropertyAction({userProperty});
      const outcome = saveUserPropertyFailure({errorResponse});

      actions$ = of(action);
      apiService.saveUserProperty.and.returnValue(
        throwError(() => errorResponse),
      );

      effects.saveUserProperty$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });
  });

  describe('getUserAddress$', () => {
    it('should return a LoadLocaleListSuccess action, with locales, on success', () => {
      const userAddress = {
        id: 'id',
        userId: 'userId',
        name: 'name',
        version: 2,
        countryCode: 'countryCode',
        phone: 'phone',
        postalOffice: 'postalOffice',
        street: 'street',
        taxID: 'taxID',
        vatID: 'vatID',
        zipCode: 'zipCode',
      } as Address;
      const action = getUserAddressAction();
      const outcome = getUserAddressSuccess({userAddress});

      actions$ = of(action);
      apiService.getUserAddress.and.returnValue(of(userAddress));

      effects.getUserAddress$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });

    it('should return a getUserAddressFailure action, on error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = getUserAddressAction();
      const outcome = getUserAddressFailure({errorResponse});

      actions$ = of(action);
      apiService.getUserAddress.and.returnValue(
        throwError(() => errorResponse),
      );

      effects.getUserAddress$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });
  });

  describe('saveUserAddress$', () => {
    it('should return a saveUserAddressSuccess action, with address, on success', () => {
      const address = {
        id: 'id',
        userId: 'userId',
        name: 'name',
        version: 2,
        countryCode: 'countryCode',
        phone: 'phone',
        postalOffice: 'postalOffice',
        street: 'street',
        taxID: 'taxID',
        vatID: 'vatID',
        zipCode: 'zipCode',
      } as Address;
      const action = saveUserAddressAction({address});
      const outcome = saveUserAddressSuccess();

      actions$ = of(action);
      apiService.saveUserAddress.and.returnValue(of(address));

      effects.saveUserAddress$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });

    it('should return a saveUserAddressFailure action, on error', () => {
      const address = {
        id: 'id',
        userId: 'userId',
        name: 'name',
        version: 2,
        countryCode: 'countryCode',
        phone: 'phone',
        postalOffice: 'postalOffice',
        street: 'street',
        taxID: 'taxID',
        vatID: 'vatID',
        zipCode: 'zipCode',
      } as Address;
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = saveUserAddressAction({address});
      const outcome = saveUserAddressFailure({errorResponse});

      actions$ = of(action);
      apiService.saveUserAddress.and.returnValue(
        throwError(() => errorResponse),
      );

      effects.saveUserAddress$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });
  });

  describe('loadStrategyData$', () => {
    it('should return a loadStrategyDataSuccess action, and strategy data on success', () => {
      const strategyData = {
        feePercentage: '1',
        feeStrategy: 'feeStrategy',
        ratioStrategy: 'ratioStrategy',
      } as StrategyData;
      const action = loadStrategyDataAction();
      const outcome = loadStrategyDataSuccess({strategyData});

      actions$ = of(action);
      strategiesService.loadActuatorStrategyData.and.returnValue(
        of(strategyData),
      );

      effects.loadStrategyData$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });

    it('should return a loadStrategyDataFailure action, on error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = loadStrategyDataAction();
      const outcome = loadStrategyDataFailure({errorResponse});

      actions$ = of(action);
      strategiesService.loadActuatorStrategyData.and.returnValue(
        throwError(() => errorResponse),
      );

      effects.loadStrategyData$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });
  });

  describe('loadSystemCurrencyList$', () => {
    it('should return a loadSystemCurrencyListSuccess action, and strategy data on success', () => {
      const systemCurrencyList = [{
        id: 1,
        minimumExchange: 3,
        currency: 'EUR'
      },
        {
          id: 2,
          minimumExchange: 4,
          currency: 'PLN'
        }] as SystemCurrency[];
      const action = loadSystemCurrencyListAction();
      const outcome = loadSystemCurrencyListSuccess({systemCurrencyList});

      actions$ = of(action);
      apiService.loadSystemCurrencyList.and.returnValue(
        of(systemCurrencyList),
      );

      effects.loadSystemCurrencyList$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });

    it('should return a loadSystemCurrencyListFailure action, on error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = loadSystemCurrencyListAction();
      const outcome = loadSystemCurrencyListFailure({errorResponse});

      actions$ = of(action);
      apiService.loadSystemCurrencyList.and.returnValue(
        throwError(() => errorResponse),
      );

      effects.loadSystemCurrencyList$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });
  });

  describe('updateSystemCurrency$', () => {
    it('should return a updateSystemCurrencySuccess action, and strategy data on success', () => {
      const systemCurrency = {
        id: 1,
        minimumExchange: 3,
        currency: 'EUR'
      } as SystemCurrency;
      const action = updateSystemCurrencyAction({systemCurrency});
      const outcome = updateSystemCurrencySuccess();

      actions$ = of(action);
      apiService.updateSystemCurrency.and.returnValue(
        of(null),
      );

      effects.updateSystemCurrency$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });

    it('should return a updateSystemCurrencyFailure action, on error', () => {
      const systemCurrency = {
        id: 1,
        minimumExchange: 3,
        currency: 'EUR'
      } as SystemCurrency;
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = updateSystemCurrencyAction({systemCurrency});
      const outcome = updateSystemCurrencyFailure({errorResponse});

      actions$ = of(action);
      apiService.updateSystemCurrency.and.returnValue(
        throwError(() => errorResponse),
      );

      effects.updateSystemCurrency$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });
  });
});
