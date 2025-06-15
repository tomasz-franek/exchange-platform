import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { DictionaryTimezone } from '../../api/model/dictionaryTimezone';
import { DictionaryLocale } from '../../api/model/dictionaryLocale';

export const loadTimezoneListAction = createAction(
  '[Dictionary] LoadTimezoneListAction',
);
export const loadTimezoneListSuccess = createAction(
  '[Dictionary] LoadTimezoneListSuccess',
  props<{ timezones: DictionaryTimezone[] }>(),
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
  props<{ locales: DictionaryLocale[] }>(),
);
export const loadLocaleListFailure = createAction(
  '[Dictionary] LoadLocaleListFailure',
  props<{
    error: HttpErrorResponse;
  }>(),
);
