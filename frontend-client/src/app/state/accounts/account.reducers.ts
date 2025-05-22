import { AccountState } from './account.selectors';
import { createReducer, on } from '@ngrx/store';
import { getUserAccountListSuccess } from './account.actions';

export const initialAccountState: AccountState = {
  userId: 0,
  accountBalance: [],
};

export const accountReducer = createReducer(
  initialAccountState,
  on(getUserAccountListSuccess, (state, action) => {
    return { ...state, accountBalance: action.accountBalance };
  }),
);
