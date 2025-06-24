import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

export const loadTimezoneListAction = createAction(
  '[Dictionary] LoadTimezoneListAction',
);
export const loadTimezoneListSuccess = createAction(
  '[Dictionary] LoadTimezoneListSuccess',
  props<{ timezones: string[] }>(),
);
export const loadTimezoneListFailure = createAction(
  '[Dictionary] LoadTimezoneListFailure',
  props<{
    error: HttpErrorResponse;
  }>(),
);

export const loadLocaleListAction = createAction(
  '[Dictionary] LoadLocaleListAction',
);
export const loadLocaleListSuccess = createAction(
  '[Dictionary] LoadLocaleListSuccess',
  props<{ locales: string[] }>(),
);
export const loadLocaleListFailure = createAction(
  '[Dictionary] LoadLocaleListFailure',
  props<{
    error: HttpErrorResponse;
  }>(),
);
