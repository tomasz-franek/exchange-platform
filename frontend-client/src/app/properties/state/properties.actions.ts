import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

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
