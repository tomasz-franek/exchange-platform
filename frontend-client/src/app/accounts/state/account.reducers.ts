import { AccountState } from './account.selectors';
import { createReducer, on } from '@ngrx/store';
import {
  loadAccountBalanceListSuccess,
  loadUserOperationListSuccess,
  saveUserAccountSuccess,
  saveUserBankAccountSuccess
} from './account.actions';

export const initialAccountState: AccountState = {
  userId: '',
  accountBalanceList: [],
  userOperationList: [],
  userAccount: null,
  userBankAccount: null
};

export const accountReducers = createReducer(
  initialAccountState,
  on(loadAccountBalanceListSuccess, (state, action) => {
    return { ...state, accountBalanceList: action.accountBalanceList };
  }),
  on(saveUserAccountSuccess, (state, action) => {
    return { ...state, userAccount: action.userAccount };
  }),
  on(loadUserOperationListSuccess, (state, action) => {
    return { ...state, userOperationList: action.userOperationList };
  }),
  on(saveUserBankAccountSuccess, (state, action) => {
    return { ...state, userBankAccount: action.userBankAccount };
  })
);
