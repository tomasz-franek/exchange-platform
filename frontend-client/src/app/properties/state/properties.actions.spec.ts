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
import { UserProperty } from '../../api/model/userProperty';
import { Address } from '../../api/model/address';

describe('Property Actions', () => {
  describe('Timezone Actions', () => {
    it('should create a LoadTimezoneListAction', () => {
      const action = loadTimezoneListAction();
      expect(action.type).toBe('[Property] LoadTimezoneListAction');
    });

    it('should create a LoadTimezoneListSuccess action with payload', () => {
      const timezones = ['UTC', 'GMT'] as string[];
      const action = loadTimezoneListSuccess({ timezones });
      expect(action.type).toBe('[Property] LoadTimezoneListSuccess');
      expect(action.timezones).toEqual(timezones);
    });

    it('should create a LoadTimezoneListFailure action with error payload', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Not Found',
        status: 404,
      });
      const action = loadTimezoneListFailure({ errorResponse });
      expect(action.type).toBe('[Property] LoadTimezoneListFailure');
      expect(action.errorResponse).toEqual(errorResponse);
    });
  });

  describe('Locale Actions', () => {
    it('should create a LoadLocaleListAction', () => {
      const action = loadLocaleListAction();
      expect(action.type).toBe('[Property] LoadLocaleListAction');
    });

    it('should create a LoadLocaleListSuccess action with payload', () => {
      const locales = ['EN', 'PL'];
      const action = loadLocaleListSuccess({ locales });
      expect(action.type).toBe('[Property] LoadLocaleListSuccess');
      expect(action.locales).toEqual(locales);
    });

    it('should create a LoadLocaleListFailure action with error payload', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Server Error',
        status: 500,
      });
      const action = loadLocaleListFailure({ errorResponse });
      expect(action.type).toBe('[Property] LoadLocaleListFailure');
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

  it('should create GetUserPropertyAction', () => {
    const action = getUserPropertyAction();
    expect(action.type).toBe('[Property] Get User Property Action');
  });

  it('should create GetUserPropertySuccess', () => {
    const userProperty: UserProperty = {
      userId: '1',
      version: 2,
      language: 'en',
      timezone: 'UTC',
    };
    const action = getUserPropertySuccess({ userProperty });
    expect(action.type).toBe('[Property] Get User Property Success');
    expect(action.userProperty).toEqual(userProperty);
  });

  it('should create GetUserPropertyFailure', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'Error message',
      status: 500,
    });
    const action = getUserPropertyFailure({ errorResponse });
    expect(action.type).toBe('[Property] Get User Property Failure');
    expect(action.errorResponse).toEqual(errorResponse);
  });

  it('should create SaveUserPropertyAction', () => {
    const userProperty: UserProperty = {
      userId: '1',
      version: 2,
      language: 'en',
      timezone: 'UTC',
    };
    const action = saveUserPropertyAction({ userProperty });
    expect(action.type).toBe('[Property] Save User Property Action');
    expect(action.userProperty).toEqual(userProperty);
  });

  it('should create SaveUserPropertySuccess', () => {
    const action = saveUserPropertySuccess();
    expect(action.type).toBe('[Property] Save User Property Success');
  });

  it('should create SaveUserPropertyFailure', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'Error message',
      status: 400,
    });
    const action = saveUserPropertyFailure({ errorResponse });
    expect(action.type).toBe('[Property] Save User Property Failure');
    expect(action.errorResponse).toEqual(errorResponse);
  });

  describe('UserAddress Actions', () => {
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
});
