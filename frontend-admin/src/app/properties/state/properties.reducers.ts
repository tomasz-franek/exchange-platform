import {createReducer, on} from '@ngrx/store';
import {PropertyState} from './properties.selectors';
import {
  getUserPropertySuccess,
  loadLocaleListSuccess,
  loadTimezoneListSuccess,
} from './properties.actions';
import {UserProperty} from '../../api/model/userProperty';

export const initialPropertyState: PropertyState = {
  timezones: [],
  locales: [],
  userProperty: {} as UserProperty,
};

export const propertyReducers = createReducer(
  initialPropertyState,
  on(loadTimezoneListSuccess, (state, action) => {
    return {...state, timezones: action.timezones};
  }),
  on(loadLocaleListSuccess, (state, action) => {
    return {...state, locales: action.locales};
  }),
  on(getUserPropertySuccess, (state, action) => {
    return {...state, userProperty: action.userProperty};
  }),
);
