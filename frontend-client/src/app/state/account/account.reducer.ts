import { AccountState } from './account.selector';
import { createReducer, on } from '@ngrx/store';
import {
  loadAccountBalanceListSuccess,
  saveUserAccountSuccess,
} from './account.action';

export const initialAccountState: AccountState = {
  userId: '',
  accountBalanceList: [],
  userAccount: null,
};

export const accountReducer = createReducer(
  initialAccountState,
  on(loadAccountBalanceListSuccess, (state, action) => {
    return { ...state, accountBalanceList: action.accountBalanceList };
  }),
  on(saveUserAccountSuccess, (state, action) => {
    return { ...state, userAccount: action.userAccount };
  }),
);
