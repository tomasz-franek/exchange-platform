import {
  selectCurrencyStatisticResponse,
  selectPairStatisticResponse,
  selectUsersStatisticResponse,
  StatisticState
} from './statistic.selectors';

describe('Report Selectors', () => {
  const mockState: StatisticState = {
    usersStatisticResponse: {
      allTickets: 4,
      activeTickets: 43,
      amountInTickets: 41,
      amountTotal: 32,
    },
    pairStatisticResponse: {
      amountTicketsSell: 2,
      amountTicketsBuy: 4,
      countTicketsBuy: 3,
      countTicketsSell: 4,
    },
    currencyStatisticResponse: {
      amountTotal: 300,
      amountInTickets: 32,
      currency: 'USD',
    },
  };
  it('should select the accounts report response', () => {
    const result = selectUsersStatisticResponse.projector(mockState);
    expect(result).toEqual(mockState.usersStatisticResponse);
  });
  it('should select pair statistic response', () => {
    const result = selectPairStatisticResponse.projector(mockState);
    expect(result).toEqual(mockState.pairStatisticResponse);
  });
  it('should select pair statistic response', () => {
    const result = selectCurrencyStatisticResponse.projector(mockState);
    expect(result).toEqual(mockState.currencyStatisticResponse);
  });
});
