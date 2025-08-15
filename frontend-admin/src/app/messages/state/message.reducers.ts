import { MessageState } from './message.selectors';
import { createReducer, on } from '@ngrx/store';
import {
  loadSystemMessageListSuccess,
  saveSystemMessageSuccess,
} from './message.actions';

export const initialMessageState: MessageState = {
  editedSystemMessage: undefined,
  systemMessages: [],
};

export const messageReducers = createReducer(
  initialMessageState,
  on(saveSystemMessageSuccess, (state, action) => {
    return { ...state, editedSystemMessage: action.systemMessage };
  }),
  on(loadSystemMessageListSuccess, (state, action) => {
    return { ...state, systemMessages: action.systemMessages };
  }),
);
