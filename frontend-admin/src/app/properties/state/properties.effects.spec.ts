import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Actions } from '@ngrx/effects';
import { of, throwError } from 'rxjs';

import { HttpErrorResponse } from '@angular/common/http';
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
  loadSystemPropertyAction,
  loadSystemPropertyFailure,
  loadSystemPropertySuccess,
  loadTimezoneListAction,
  loadTimezoneListFailure,
  loadTimezoneListSuccess,
  saveUserAddressAction,
  saveUserAddressFailure,
  saveUserAddressSuccess,
  saveUserPropertyAction,
  saveUserPropertyFailure,
  saveUserPropertySuccess,
} from './properties.actions';
import { PropertiesEffects } from './properties.effects';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { UserProperty } from '../../api/model/userProperty';
import { Address } from '../../api/model/address';
import { SystemPropertyResponse } from '../../api';

describe('PropertiesEffects', () => {
  let effects: PropertiesEffects;
  let actions$: Actions;
  let apiService: jasmine.SpyObj<ApiService>;
  let toastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    const apiServiceSpy = jasmine.createSpyObj('ApiService', [
      'loadTimezoneList',
      'loadUnicodeLocalesList',
      'getUserProperty',
      'saveUserProperty',
      'getUserAddress',
      'saveUserAddress',
      'loadSystemProperties',
    ]);

    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', [
      'info',
      'error',
    ]);

    TestBed.configureTestingModule({
      providers: [
        PropertiesEffects,
        provideMockActions(() => actions$),
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
      ],
    });

    effects = TestBed.inject(PropertiesEffects);
    actions$ = TestBed.inject(Actions);
    apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    toastrService = TestBed.inject(
      ToastrService,
    ) as jasmine.SpyObj<ToastrService>;
  });

  describe('loadTimezones$', () => {
    it('should return a LoadTimezoneListSuccess action, with timezones, on success', () => {
      const timezones = ['UTC', 'GMT'];
      const action = loadTimezoneListAction();
      const outcome = loadTimezoneListSuccess({ timezones });

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
      const outcome = loadTimezoneListFailure({ errorResponse });

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
      const outcome = loadLocaleListSuccess({ locales });

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
      const outcome = loadLocaleListFailure({ errorResponse });

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
      const outcome = getUserPropertySuccess({ userProperty });

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
      const outcome = getUserPropertyFailure({ errorResponse });

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
      const action = saveUserPropertyAction({ userProperty });
      const outcome = saveUserPropertySuccess();

      actions$ = of(action);
      apiService.saveUserProperty.and.returnValue(of(userProperty));

      effects.saveUserProperty$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
      expect(toastrService.info).toHaveBeenCalledWith('Property saved');
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
      const action = saveUserPropertyAction({ userProperty });
      const outcome = saveUserPropertyFailure({ errorResponse });

      actions$ = of(action);
      apiService.saveUserProperty.and.returnValue(
        throwError(() => errorResponse),
      );

      effects.saveUserProperty$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
      expect(toastrService.error).toHaveBeenCalledWith(
        'Error occurred while saving user property',
      );
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
      const outcome = getUserAddressSuccess({ userAddress });

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
      const outcome = getUserAddressFailure({ errorResponse });

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
      const action = saveUserAddressAction({ address });
      const outcome = saveUserAddressSuccess();

      actions$ = of(action);
      apiService.saveUserAddress.and.returnValue(of(address));

      effects.saveUserAddress$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
      expect(toastrService.info).toHaveBeenCalledWith('Address saved');
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
      const action = saveUserAddressAction({ address });
      const outcome = saveUserAddressFailure({ errorResponse });

      actions$ = of(action);
      apiService.saveUserAddress.and.returnValue(
        throwError(() => errorResponse),
      );

      effects.saveUserAddress$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
      expect(toastrService.error).toHaveBeenCalledWith(
        'Error occurred while saving user address',
      );
    });
  });

  describe('loadSystemProperties$', () => {
    it('should return a loadSystemPropertySuccess action, with locales, on success', () => {
      const systemPropertyResponse = {
        feeStrategy: 'feeStrategy',
        ratioStrategy: 'ratioStrategy',
      } as SystemPropertyResponse;
      const action = loadSystemPropertyAction();
      const outcome = loadSystemPropertySuccess({ systemPropertyResponse });

      actions$ = of(action);
      apiService.loadSystemProperties.and.returnValue(
        of(systemPropertyResponse),
      );

      effects.loadSystemProperties$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });

    it('should return a loadSystemPropertyFailure action, on error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = loadSystemPropertyAction();
      const outcome = loadSystemPropertyFailure({ errorResponse });

      actions$ = of(action);
      apiService.loadSystemProperties.and.returnValue(
        throwError(() => errorResponse),
      );

      effects.loadSystemProperties$.subscribe((result) => {
        expect(result).toEqual(outcome);
      });
    });
  });
});
