import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { SystemMessage } from '../../api/model/systemMessage';

export const loadMessageListAction = createAction(
  '[Message] Load Message List Action'
);
export const loadMessageListActionSuccess = createAction(
  '[Message] Load Message List Action Success',
  props<{ systemMessageList: SystemMessage[] }>()
);

export const loadMessageListActionFailure = createAction(
  '[Message] Load Message List Action Failure',
  props<{
    errorResponse: HttpErrorResponse;
  }>()
);
