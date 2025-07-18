import {selectTransactions, TransactionState} from "./transaction.selectors";
import {Transaction} from "../../api/model/transaction";

describe('Transaction Selectors', () => {
  const mockState: TransactionState = {
    transactions: [{dateUTC: '1', value: 1}, {dateUTC: '2', value: 2}] as Transaction[]
  };
  it('should select the accounts report response', () => {
    const result = selectTransactions.projector(mockState);
    expect(result).toEqual(mockState.transactions);
  });
});
