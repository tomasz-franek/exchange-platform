import { AccountState } from './account.selectors';
import { createReducer, on } from '@ngrx/store';
import {
  loadAccountListSuccess,
  loadAccountOperationListSuccess,
  loadSystemAccountListSuccess,
  loadUserListActionSuccess,
} from './account.actions';

export const initialAccountState: AccountState = {
  userAccounts: [],
  users: [],
  systemAccounts: [],
  accountOperations: [],
};

export const accountReducers = createReducer(
  initialAccountState,
  on(loadAccountListSuccess, (state, action) => {
    return { ...state, userAccounts: action.userAccounts };
  }),
  on(loadUserListActionSuccess, (state, action) => {
    return { ...state, users: action.users };
  }),
  on(loadSystemAccountListSuccess, (state, action) => {
    return { ...state, systemAccounts: action.systemAccounts };
  }),
  on(loadAccountOperationListSuccess, (state, action) => {
    return {
      ...state,
      accountOperations: action.accountOperations,
    };
  }),
);
