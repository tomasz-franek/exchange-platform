import { selectTransactions, TransactionState } from './transaction.selectors';
import { Transaction } from '../../api/model/transaction';

describe('Transaction Selectors', () => {
  const mockState: TransactionState = {
    transactions: [
      { dateUtc: '1', amount: 1 },
      { dateUtc: '2', amount: 2 },
    ] as Transaction[],
  };
  it('should select the accounts report response', () => {
    const result = selectTransactions.projector(mockState);
    expect(result).toEqual(mockState.transactions);
  });
});
