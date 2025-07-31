import {createAction, props} from '@ngrx/store';
import {HttpErrorResponse} from '@angular/common/http';
import {UserProperty} from '../../api/model/userProperty';

export const loadTimezoneListAction = createAction(
  '[Property] LoadTimezoneListAction',
);
export const loadTimezoneListSuccess = createAction(
  '[Property] LoadTimezoneListSuccess',
  props<{ timezones: string[] }>(),
);
export const loadTimezoneListFailure = createAction(
  '[Property] LoadTimezoneListFailure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);

export const loadLocaleListAction = createAction(
  '[Property] LoadLocaleListAction',
);
export const loadLocaleListSuccess = createAction(
  '[Property] LoadLocaleListSuccess',
  props<{ locales: string[] }>(),
);
export const loadLocaleListFailure = createAction(
  '[Property] LoadLocaleListFailure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);


export const getUserPropertyAction = createAction(
  '[Property] GetUserProperty Action',
);

export const getUserPropertySuccess = createAction(
  '[Property] GetUserPropertySuccess',
  props<{ userProperty: UserProperty }>(),
);

export const getUserPropertyFailure = createAction(
  '[Property] GetUserPropertyFailure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);

export const saveUserPropertyAction = createAction(
  '[Property] SaveUserPropertyAction',
  props<{ userProperty: UserProperty }>(),
);

export const saveUserPropertySuccess = createAction(
  '[Property] SaveUserPropertySuccess',
);

export const saveUserPropertyFailure = createAction(
  '[Property] SaveUserPropertyFailure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);

