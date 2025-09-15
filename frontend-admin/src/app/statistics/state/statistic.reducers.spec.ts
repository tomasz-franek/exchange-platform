import { initialStatisticState, statisticReducers } from './statistic.reducers';
import {
  loadCurrencyStatisticSuccess,
  loadPairStatisticSuccess,
  loadUserStatisticSuccess,
} from './statistic.actions';
import { UsersStatisticResponse } from '../../api/model/usersStatisticResponse';
import { CurrencyStatisticResponse } from '../../api/model/currencyStatisticResponse';
import { PairStatisticResponse } from '../../api/model/pairStatisticResponse';

describe('statisticReducers', () => {
  it('should return the initial state', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = statisticReducers(undefined, action);
    expect(state).toBe(initialStatisticState);
  });
  it('should handle loadAccountListSuccess', () => {
    const usersStatisticResponse: UsersStatisticResponse = {
      allTickets: 4,
      activeTickets: 43,
      amountInTickets: 41,
      amountTotal: 32,
    };
    const action = loadUserStatisticSuccess({ usersStatisticResponse });
    const state = statisticReducers(initialStatisticState, action);

    expect(state.usersStatisticResponse).toEqual(usersStatisticResponse);
  });
  it('should handle loadCurrencyStatisticSuccess', () => {
    const currencyStatisticResponse: CurrencyStatisticResponse = {
      amountTotal: 34,
      amountInTickets: 2,
    };
    const action = loadCurrencyStatisticSuccess({ currencyStatisticResponse });
    const state = statisticReducers(initialStatisticState, action);

    expect(state.currencyStatisticResponse).toEqual(currencyStatisticResponse);
  });

  it('should handle loadCurrencyStatisticSuccess', () => {
    const pairStatisticResponse: PairStatisticResponse = {
      amountTicketsSell: 3,
      amountTicketsBuy: 5,
    };
    const action = loadPairStatisticSuccess({ pairStatisticResponse });
    const state = statisticReducers(initialStatisticState, action);

    expect(state.pairStatisticResponse).toEqual(pairStatisticResponse);
  });
});
