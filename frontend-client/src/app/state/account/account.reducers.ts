import { AccountState } from './account.selectors';
import { createReducer, on } from '@ngrx/store';
import {
  getUserPropertySuccess,
  loadAccountBalanceListSuccess,
  loadUserOperationListSuccess,
  saveUserAccountSuccess,
} from './account.actions';
import { UserProperty } from '../../api';

export const initialAccountState: AccountState = {
  userId: '',
  accountBalanceList: [],
  userOperationList: [],
  userAccount: null,
  userProperty: {} as UserProperty,
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
  on(getUserPropertySuccess, (state, action) => {
    return { ...state, userProperty: action.userProperty };
  }),
);
