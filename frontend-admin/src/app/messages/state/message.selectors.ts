import {SystemMessage} from "../../api/model/systemMessage";
import {createFeatureSelector, createSelector} from "@ngrx/store";
import {Features} from "../../features";

export interface MessageState {
  editedSystemMessage: SystemMessage | undefined;
}

export const selectMessageFutureState = createFeatureSelector<MessageState>(
    Features.messages,
);


export const selectEditedSystemMessages = createSelector(
    selectMessageFutureState,
    (state: MessageState) => state.editedSystemMessage,
);