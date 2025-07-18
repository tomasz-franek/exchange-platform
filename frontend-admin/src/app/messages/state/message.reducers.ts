import {MessageState} from "./message.selectors";
import {createReducer, on} from "@ngrx/store";
import {saveSystemMessageSuccess} from "./message.actions";

export const initialMessageState: MessageState = {
  editedSystemMessage: undefined,
};

export const messageReducers = createReducer(
    initialMessageState,
    on(saveSystemMessageSuccess, (state, action) => {
      return {...state, editedSystemMessage: action.systemMessage};
    })
);
