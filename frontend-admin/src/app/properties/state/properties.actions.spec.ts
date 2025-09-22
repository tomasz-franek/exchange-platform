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
import {UserProperty} from '../../api/model/userProperty';
import {Address} from '../../api/model/address';
import {StrategyData} from '../services/strategy.data';
import {SystemCurrency} from '../../api/model/systemCurrency';

describe('Property Actions', () => {
  describe('Timezone Actions', () => {
    it('should create a LoadTimezoneListAction', () => {
      const action = loadTimezoneListAction();
      expect(action.type).toBe('[Property] Load Timezone List Action');
    });

    it('should create a LoadTimezoneListSuccess action with payload', () => {
      const timezones = ['UTC', 'GMT'] as string[];
      const action = loadTimezoneListSuccess({ timezones });
      expect(action.type).toBe('[Property] Load Timezone List Success');
      expect(action.timezones).toEqual(timezones);
    });

    it('should create a LoadTimezoneListFailure action with error payload', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Not Found',
        status: 404,
      });
      const action = loadTimezoneListFailure({ errorResponse });
      expect(action.type).toBe('[Property] Load Timezone List Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('Locale Actions', () => {
    it('should create a LoadLocaleListAction', () => {
      const action = loadLocaleListAction();
      expect(action.type).toBe('[Property] Load Locale List Action');
    });

    it('should create a LoadLocaleListSuccess action with payload', () => {
      const locales = ['EN', 'PL'];
      const action = loadLocaleListSuccess({ locales });
      expect(action.type).toBe('[Property] Load Locale List Success');
      expect(action.locales).toEqual(locales);
    });

    it('should create a LoadLocaleListFailure action with error payload', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = loadLocaleListFailure({ errorResponse });
      expect(action.type).toBe('[Property] Load Locale List Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('UserProperty Actions', () => {
    it('should create a getUserPropertyAction', () => {
      const action = getUserPropertyAction();
      expect(action.type).toBe('[Property] Get User Property Action');
    });

    it('should create a getUserPropertySuccess action with payload', () => {
      const userProperty: UserProperty = {
        userId: 'userId',
        locale: 'locale',
        version: 2,
        timezone: 'timezone',
        language: 'en-US',
      };
      const action = getUserPropertySuccess({ userProperty });
      expect(action.type).toBe('[Property] Get User Property Success');
      expect(action.userProperty).toEqual(userProperty);
    });

    it('should create a getUserPropertyFailure action with error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = getUserPropertyFailure({ errorResponse });
      expect(action.type).toBe('[Property] Get User Property Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('SaveUserProperty Actions', () => {
    const userProperty: UserProperty = {
      userId: 'userId',
      locale: 'locale',
      version: 2,
      timezone: 'timezone',
      language: 'en-US',
    };
    it('should create a saveUserPropertyAction', () => {
      const action = saveUserPropertyAction({ userProperty });
      expect(action.type).toBe('[Property] Save User Property Action');
    });

    it('should create a saveUserPropertySuccess action with payload', () => {
      const action = saveUserPropertySuccess();
      expect(action.type).toBe('[Property] Save User Property Success');
    });

    it('should create a saveUserPropertyFailure action with error payload', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = saveUserPropertyFailure({ errorResponse });
      expect(action.type).toBe('[Property] Save User Property Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('get UserAddress Actions', () => {
    it('should create a getUserAddressAction', () => {
      const action = getUserAddressAction();
      expect(action.type).toBe('[Property] Get User Address Action');
    });

    it('should create a getUserAddressSuccess action with payload', () => {
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
      const action = getUserAddressSuccess({ userAddress });
      expect(action.type).toBe('[Property] Get User Address Success');
      expect(action.userAddress).toEqual(userAddress);
    });

    it('should create a getUserAddressFailure action with error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = getUserAddressFailure({ errorResponse });
      expect(action.type).toBe('[Property] Get User Address Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('save UserAddress Actions', () => {
    it('should create a save', () => {
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
      const action = saveUserAddressAction({ address: userAddress });
      expect(action.type).toBe('[Property] Save User Address Action');
    });

    it('should create a saveUserAddressSuccess action with payload', () => {
      const action = saveUserAddressSuccess();
      expect(action.type).toBe('[Property] Save User Address Success');
    });

    it('should create a saveUserAddressFailure action with error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = saveUserAddressFailure({ errorResponse });
      expect(action.type).toBe('[Property] Save User Address Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('Strategy Data Actions', () => {
    it('should create a loadStrategyDataAction', () => {
      const action = loadStrategyDataAction();
      expect(action.type).toBe('[Property] Load Strategy Data Action');
    });

    it('should create a loadStrategyDataSuccess action with payload', () => {
      const strategyData = {
        feePercentage: '1',
        feeStrategy: 'feeStrategy',
        ratioStrategy: 'ratioStrategy',
      } as StrategyData;
      const action = loadStrategyDataSuccess({strategyData});
      expect(action.type).toBe('[Property] Load Strategy Data Success');
      expect(action.strategyData).toEqual(strategyData);
    });

    it('should create a loadStrategyDataFailure action with error payload', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = loadStrategyDataFailure({errorResponse});
      expect(action.type).toBe('[Property] Load Strategy Data Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('System Currency List Action', () => {
    it('should create a loadSystemCurrencyListAction', () => {
      const action = loadSystemCurrencyListAction();
      expect(action.type).toBe('[Property] Load System Currency List Action',);
    });

    it('should create a loadSystemCurrencyListSuccess action with payload', () => {
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
      const action = loadSystemCurrencyListSuccess({systemCurrencyList});
      expect(action.type).toBe('[Property] Load System Currency List Success');
      expect(action.systemCurrencyList).toEqual(systemCurrencyList);
    });

    it('should create a loadSystemCurrencyListFailure action with error payload', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = loadSystemCurrencyListFailure({errorResponse});
      expect(action.type).toBe('[Property] Load System Currency List Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });
  describe('Update System Currency Action', () => {
    it('should create a updateSystemCurrencyAction', () => {
      let systemCurrency = {
        id: 2,
        minimumExchange: 4,
        currency: 'PLN'
      } as SystemCurrency;
      const action = updateSystemCurrencyAction({systemCurrency});
      expect(action.type).toBe('[Property] Update System Currency Action',);
    });

    it('should create a updateSystemCurrencySuccess action with payload', () => {
      const action = updateSystemCurrencySuccess();
      expect(action.type).toBe('[Property] Update System Currency Success');
    });

    it('should create a updateSystemCurrencyFailure action with error payload', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = updateSystemCurrencyFailure({errorResponse});
      expect(action.type).toBe('[Property] Update System Currency Failure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });
});
