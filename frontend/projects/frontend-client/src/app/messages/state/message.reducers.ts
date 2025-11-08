import { createReducer, on } from '@ngrx/store';
import { MessageState } from './message.selectors';
import { loadMessageListActionSuccess } from './message.actions';

export const initialMessageState: MessageState = {
  systemMessageList: [],
};

export const messageReducers = createReducer(
  initialMessageState,
  on(loadMessageListActionSuccess, (state, action) => {
    return { ...state, systemMessageList: action.systemMessageList };
  }),
);
