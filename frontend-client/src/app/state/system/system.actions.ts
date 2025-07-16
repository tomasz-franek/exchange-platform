import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { BuildInfo } from '../../api/model/buildInfo';
import { SystemMessage } from '../../api/model/systemMessage';

export const loadBuildInfoAction = createAction('[System] Load BuildInfo');
export const loadBuildInfoActionSuccess = createAction(
  '[System] Load Build Info Action Success',
  props<{ buildInfo: BuildInfo }>(),
);

export const loadBuildInfoActionError = createAction(
  '[System] Load Build Info Action Error',
  props<{
    error: HttpErrorResponse;
  }>(),
);

export const loadSystemMessageListAction = createAction(
  '[System] Load System Message List Action',
);
export const loadSystemMessageListActionSuccess = createAction(
  '[System] Load System Message List Action Success',
  props<{ systemMessageList: SystemMessage[] }>(),
);

export const loadSystemMessageListActionError = createAction(
  '[System] Load System Message List Action Error',
  props<{
    error: HttpErrorResponse;
  }>(),
);
