import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { UserProperty } from '../../api/model/userProperty';
import { Address } from '../../api/model/address';
import { SystemCurrency } from '../../api/model/systemCurrency';

export const loadTimezoneListAction = createAction(
  '[Property] LoadTimezoneListAction'
);
export const loadTimezoneListSuccess = createAction(
  '[Property] LoadTimezoneListSuccess',
  props<{ timezones: string[] }>()
);
export const loadTimezoneListFailure = createAction(
  '[Property] LoadTimezoneListFailure',
  props<{
    errorResponse: HttpErrorResponse;
  }>()
);

export const loadLocaleListAction = createAction(
  '[Property] LoadLocaleListAction'
);
export const loadLocaleListSuccess = createAction(
  '[Property] LoadLocaleListSuccess',
  props<{ locales: string[] }>()
);
export const loadLocaleListFailure = createAction(
  '[Property] LoadLocaleListFailure',
  props<{
    errorResponse: HttpErrorResponse;
  }>()
);

export const getUserPropertyAction = createAction(
  '[Property] Get User Property Action'
);

export const getUserPropertySuccess = createAction(
  '[Property] Get User Property Success',
  props<{ userProperty: UserProperty }>()
);

export const getUserPropertyFailure = createAction(
  '[Property] Get User Property Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>()
);

export const saveUserPropertyAction = createAction(
  '[Property] Save User Property Action',
  props<{ userProperty: UserProperty }>()
);

export const saveUserPropertySuccess = createAction(
  '[Property] Save User Property Success'
);

export const saveUserPropertyFailure = createAction(
  '[Property] Save User Property Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>()
);

export const getUserAddressAction = createAction(
  '[Property] Get User Address Action'
);

export const getUserAddressSuccess = createAction(
  '[Property] Get User Address Success',
  props<{ userAddress: Address }>()
);

export const getUserAddressFailure = createAction(
  '[Property] Get User Address Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>()
);

export const saveUserAddressAction = createAction(
  '[Property] Save User Address Action',
  props<{ address: Address }>()
);

export const saveUserAddressSuccess = createAction(
  '[Property] Save User Address Success'
);

export const saveUserAddressFailure = createAction(
  '[Property] Save User Address Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>()
);

export const loadSystemCurrencyListAction = createAction(
  '[Property] Load System Currency List Action'
);


export const loadSystemCurrencyListSuccess = createAction(
  '[Property] Load System Currency List Success',
  props<{ systemCurrencyList: SystemCurrency[] }>()
);

export const loadSystemCurrencyListFailure = createAction(
  '[Property] Load System Currency List Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>()
);
