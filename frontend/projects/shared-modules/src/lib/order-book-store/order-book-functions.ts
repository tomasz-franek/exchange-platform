import { OrderBookRow } from '../api/model/orderBookRow';

export function sortFunction(a: OrderBookRow, b: OrderBookRow): number {
  if (a.r !== b.r) {
    return a.r - b.r;
  }
  return a.a - b.a;
}
export function sortArrayAscending(
  unsortedArray: OrderBookRow[],
): OrderBookRow[] {
  return unsortedArray.sort((a: OrderBookRow, b: OrderBookRow) => {
    return sortFunction(a, b);
  });
}

export function sortArrayDescending(
  unsortedArray: OrderBookRow[],
): OrderBookRow[] {
  return unsortedArray.sort((a: OrderBookRow, b: OrderBookRow) => {
    return sortFunction(b, a);
  });
}

export function removeEmptyRows(orderBookRows: OrderBookRow[]): OrderBookRow[] {
  return orderBookRows.filter((row: OrderBookRow) => {
    return row.a > 0;
  });
}

export function updateRowValue(
  orderBookRows: OrderBookRow[],
  orderBookRow: OrderBookRow,
) {
  let changedRow = orderBookRows.find((currentRow) => {
    return currentRow.r === orderBookRow.r;
  });
  if (changedRow) {
    changedRow.a = changedRow.a + orderBookRow.a;
  } else {
    orderBookRows.push(orderBookRow);
  }
}
