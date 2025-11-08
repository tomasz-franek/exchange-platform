import { createFeatureSelector, createSelector } from '@ngrx/store';
import {Features} from '../../../../../shared-modules/src/lib/features';
import { SystemMessage } from '../../api/model/systemMessage';

export interface MessageState {
  systemMessageList: SystemMessage[];
}

export const selectSystemFutureState = createFeatureSelector<MessageState>(
  Features.messages,
);

export const selectSystemMessageList = createSelector(
  selectSystemFutureState,
  (state) => state.systemMessageList,
);
