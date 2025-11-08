import { SystemMessage } from '../../api/model/systemMessage';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import {Features} from '../../../../../shared-modules/src/lib/features';

export interface MessageState {
  editedSystemMessage: SystemMessage | undefined;
  systemMessages: SystemMessage[];
}

export const selectMessageFutureState = createFeatureSelector<MessageState>(
  Features.messages,
);

export const selectEditedSystemMessages = createSelector(
  selectMessageFutureState,
  (state: MessageState) => state.editedSystemMessage,
);

export const selectSystemMessages = createSelector(
  selectMessageFutureState,
  (state: MessageState) => state.systemMessages,
);
