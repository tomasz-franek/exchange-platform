import { AccountState } from './account.selectors';
import { createReducer, on } from '@ngrx/store';
import {
  loadAccountBalanceListSuccess,
  saveUserAccountSuccess,
} from './account.actions';

export const initialAccountState: AccountState = {
  userId: '',
  accountBalanceList: [],
  userAccount: null,
};

export const accountReducers = createReducer(
  initialAccountState,
  on(loadAccountBalanceListSuccess, (state, action) => {
    return { ...state, accountBalanceList: action.accountBalanceList };
  }),
  on(saveUserAccountSuccess, (state, action) => {
    return { ...state, userAccount: action.userAccount };
  }),
);
