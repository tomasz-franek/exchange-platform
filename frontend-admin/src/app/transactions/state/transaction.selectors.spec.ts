import {
  selectExchangeTransactions,
  selectSystemTransactions,
  selectTransactions,
  TransactionState,
} from './transaction.selectors';

describe('Transaction Selectors', () => {
  const mockState: TransactionState = {
    transactions: [
      { dateUtc: '1', amount: 1 },
      { dateUtc: '2', amount: 2 },
    ],
    systemTransactions: [
      { dateUtc: '3', amount: 3 },
      { dateUtc: '4', amount: 4 },
    ],
    exchangeTransactions: [
      { dateUtc: '5', amount: 5 },
      { dateUtc: '6', amount: 6 },
    ],
  };
  it('should select the transactions report response', () => {
    const result = selectTransactions.projector(mockState);
    expect(result).toEqual(mockState.transactions);
  });

  it('should select the system transactions report response', () => {
    const result = selectSystemTransactions.projector(mockState);
    expect(result).toEqual(mockState.systemTransactions);
  });

  it('should select the exchange transactions report response', () => {
    const result = selectExchangeTransactions.projector(mockState);
    expect(result).toEqual(mockState.exchangeTransactions);
  });
});
