import { createAction, props } from '@ngrx/store';
import { SystemMessage } from '../../api/model/systemMessage';
import { HttpErrorResponse } from '@angular/common/http';

export const saveSystemMessageAction = createAction(
  '[Message] Saving system message Action',
  props<{ systemMessage: SystemMessage }>(),
);
export const saveSystemMessageSuccess = createAction(
  '[Message] Save system message Action success',
  props<{ systemMessage: SystemMessage }>(),
);

export const saveSystemMessageFailure = createAction(
  '[Message] Save system message Action failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);

export const loadSystemMessageListAction = createAction(
  '[Message] Load System Message List',
  props<{ systemMessage: SystemMessage }>(),
);
export const loadSystemMessageListSuccess = createAction(
  '[Message] Load System Message List Success',
  props<{ systemMessages: SystemMessage[] }>(),
);

export const loadSystemMessageListFailure = createAction(
  '[Message] Load System Message List Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>(),
);
