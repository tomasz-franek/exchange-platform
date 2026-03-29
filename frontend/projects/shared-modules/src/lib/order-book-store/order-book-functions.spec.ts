import {OrderBookRow} from '../api/model/orderBookRow';
import {
  removeEmptyRows,
  sortArrayAscending,
  sortArrayDescending,
  sortFunction,
  updateRowValue,
} from './order-book-functions';

describe('OrderBook Functions', () => {
  describe('sortFunction', () => {
    it('returns negative when ratio a < ratio b', () => {
      const a: OrderBookRow = { r: 1, a: 100 };
      const b: OrderBookRow = { r: 2, a: 50 };
      expect(sortFunction(a, b)).toBeLessThan(0);
    });

    it('returns positive when ratio a > ratio b', () => {
      const a: OrderBookRow = { r: 5, a: 10 };
      const b: OrderBookRow = { r: 3, a: 20 };
      expect(sortFunction(a, b)).toBeGreaterThan(0);
    });

    it('compares amount when ratio values are equal and amount a < amount b', () => {
      const a: OrderBookRow = { r: 4, a: 10 };
      const b: OrderBookRow = { r: 4, a: 20 };
      expect(sortFunction(a, b)).toBeLessThan(0);
    });

    it('compares amount when ratio values are equal and  amount a > amount b', () => {
      const a: OrderBookRow = { r: 4, a: 30 };
      const b: OrderBookRow = { r: 4, a: 20 };
      expect(sortFunction(a, b)).toBeGreaterThan(0);
    });

    it('returns 0 when both ratio and amount are equal', () => {
      const a: OrderBookRow = { r: 7, a: 50 };
      const b: OrderBookRow = { r: 7, a: 50 };
      expect(sortFunction(a, b)).toBe(0);
    });

    it('works with negative and zero values', () => {
      const a: OrderBookRow = { r: 0, a: -10 };
      const b: OrderBookRow = { r: -1, a: 100 };
      expect(sortFunction(a, b)).toBeGreaterThan(0);
    });
  });

  describe('sortArrayDescending', () => {
    it('sorts by ratio then amount descending', () => {
      const orderBookArray: OrderBookRow[] = [
        { r: 7, a: 28 },
        { r: 1, a: 44 },
        { r: 2, a: 43 },
        { r: 1, a: 12 },
        { r: 2, a: 12 },
      ];
      const result = sortArrayDescending(orderBookArray);
      expect(result).toEqual([
        { r: 7, a: 28 },
        { r: 2, a: 43 },
        { r: 2, a: 12 },
        { r: 1, a: 44 },
        { r: 1, a: 12 },
      ]);
    });

    it('returns empty array when given empty array', () => {
      const orderBookArray: OrderBookRow[] = [];
      const result: OrderBookRow[] = sortArrayDescending(orderBookArray);
      expect(result).toEqual([]);
    });

    it('handles single-element array', () => {
      const orderBookArray: OrderBookRow[] = [{ r: 10, a: 2 }];
      const result: OrderBookRow[] = sortArrayDescending(orderBookArray);
      expect(result).toEqual([{ r: 10, a: 2 }]);
    });

    it('for equal keys keeps relative order when ratio and amount equal', () => {
      const orderBookArray: OrderBookRow[] = [
        { r: 2, a: 10 } as OrderBookRow,
        { r: 2, a: 10 } as OrderBookRow,
      ];
      const result = sortArrayDescending(orderBookArray);
      expect(result[0]).toBe(orderBookArray[0]);
      expect(result[1]).toBe(orderBookArray[1]);
    });
  });

  describe('sortArrayAscending', () => {
    it('sorts by ratio then amount ascending', () => {
      const orderBookArray: OrderBookRow[] = [
        { r: 7, a: 28 },
        { r: 1, a: 44 },
        { r: 2, a: 43 },
        { r: 1, a: 12 },
        { r: 2, a: 12 },
      ];
      const result = sortArrayAscending(orderBookArray);
      expect(result).toEqual([
        { r: 1, a: 12 },
        { r: 1, a: 44 },
        { r: 2, a: 12 },
        { r: 2, a: 43 },
        { r: 7, a: 28 },
      ]);
    });

    it('returns empty array when given empty input array', () => {
      const orderBookArray: OrderBookRow[] = [];
      const result: OrderBookRow[] = sortArrayAscending(orderBookArray);
      expect(result).toEqual([]);
    });

    it('when one element then return same array', () => {
      const orderBookArray: OrderBookRow[] = [{ r: 5, a: 10 }];
      const result: OrderBookRow[] = sortArrayAscending(orderBookArray);
      expect(result).toEqual([{ r: 5, a: 10 }]);
    });

    it('for equal keys keeps relative order when ratio and amount equal', () => {
      const orderBookArray: OrderBookRow[] = [
        { r: 2, a: 10 } as OrderBookRow,
        { r: 2, a: 10 } as OrderBookRow,
      ];
      const result = sortArrayAscending(orderBookArray);
      expect(result[0]).toBe(orderBookArray[0]);
      expect(result[1]).toBe(orderBookArray[1]);
    });
  });

  describe('removeEmptyRows', () => {
    it('removes rows with amount is 0', () => {
      const orderBookArray: OrderBookRow[] = [
        { r: 1, a: 0 },
        { r: 2, a: 10 },
        { r: 3, a: 0 },
        { r: 4, a: 0 },
        { r: 5, a: 20 },
      ];
      const result = removeEmptyRows(orderBookArray);
      expect(result).toEqual([
        { r: 2, a: 10 },
        { r: 5, a: 20 },
      ]);
    });

    it('removes rows with amount les than 0', () => {
      const orderBookArray: OrderBookRow[] = [
        { r: 1, a: -1 },
        { r: 2, a: -2 },
        { r: 3, a: 3 },
      ];
      const result = removeEmptyRows(orderBookArray);
      expect(result).toEqual([{ r: 3, a: 3 }]);
    });

    it('keeps rows with amount greater than 0', () => {
      const orderBookArray: OrderBookRow[] = [
        { r: 1, a: 1 },
        { r: 2, a: 100 },
      ];
      const result = removeEmptyRows(orderBookArray);
      expect(result).toEqual(orderBookArray);
    });

    it('returns empty array when all rows are amount zero or negative', () => {
      const orderBookArray: OrderBookRow[] = [
        { r: 1, a: 0 },
        { r: 2, a: -10 },
      ];
      const result = removeEmptyRows(orderBookArray);
      expect(result).toEqual([]);
    });

    it('returns empty array when given empty array', () => {
      const orderBookArray: OrderBookRow[] = [];
      const result = removeEmptyRows(orderBookArray);
      expect(result).toEqual([]);
    });

    it('does not mutate the original array', () => {
      const orderBookArray: OrderBookRow[] = [
        { r: 1, a: 0 },
        { r: 2, a: 5 },
      ];
      const copy = orderBookArray;
      removeEmptyRows(orderBookArray);
      expect(orderBookArray).toEqual(copy);
    });
  });

  describe('updateRowValue', () => {
    it('adds amount to existing row with same ratio', () => {
      const rows: OrderBookRow[] = [
        { r: 1, a: 1 },
        { r: 2, a: 5 },
      ];
      updateRowValue(rows, { r: 1, a: 5 });
      expect(rows).toEqual([
        { r: 1, a: 6 },
        { r: 2, a: 5 },
      ]);
    });

    it('added new rows when ratio not found', () => {
      const rows: OrderBookRow[] = [
        { r: 3, a: 3 },
        { r: 1, a: 1 },
      ];
      updateRowValue(rows, { r: 2, a: 2 });
      expect(rows).toEqual([
        { r: 3, a: 3 },
        { r: 1, a: 1 },
        { r: 2, a: 2 },
      ]);
    });

    it('handles zero amount update (existing row)', () => {
      const rows: OrderBookRow[] = [{ r: 1, a: 10 }];
      updateRowValue(rows, { r: 1, a: 0 });
      expect(rows).toEqual([{ r: 1, a: 10 }]);
    });

    it('handles negative amount (remove existing row)', () => {
      const rows: OrderBookRow[] = [{ r: 1, a: 10 }];
      updateRowValue(rows, { r: 1, a: -3 });
      expect(rows).toEqual([{ r: 1, a: 7 }]);
    });

    it('does not mutate other rows order or create duplicates for existing r', () => {
      const rows: OrderBookRow[] = [
        { r: 1, a: 2 },
        { r: 2, a: 3 },
      ];
      updateRowValue(rows, { r: 2, a: 5 });
      const matches = rows.filter((x) => x.r === 2);
      expect(matches.length).toBe(1);
      expect(matches[0].a).toBe(8);
      expect(rows[0]).toEqual({ r: 1, a: 2 });
    });

    it('adds row when orderBookArray array is empty', () => {
      const rows: OrderBookRow[] = [];
      updateRowValue(rows, { r: 1, a: 5 });
      expect(rows).toEqual([{ r: 1, a: 5 }]);
    });

    it('mutates the original array (in-place)', () => {
      const rows: OrderBookRow[] = [{ r: 1, a: 1 }];
      const ref = rows;
      updateRowValue(rows, { r: 1, a: 2 });
      expect(rows).toBe(ref);
      expect(rows[0].a).toBe(3);
    });
  });
});
