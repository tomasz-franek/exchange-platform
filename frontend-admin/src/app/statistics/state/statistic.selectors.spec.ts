import {
  selectCurrencyStatisticResponse,
  selectPairStatisticResponse,
  selectUsersStatisticResponse,
  StatisticState,
} from './statistic.selectors';

describe('Report Selectors', () => {
  const mockState: StatisticState = {
    usersStatisticResponse: {
      all: 4,
      active: 43,
      blocked: 41,
    },
    pairStatisticResponse: {
      amountTicketsSell: 2,
      amountTicketsBuy: 4,
    },
    currencyStatisticResponse: {
      amountTotal: 300,
      amountInTickets: 32,
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
