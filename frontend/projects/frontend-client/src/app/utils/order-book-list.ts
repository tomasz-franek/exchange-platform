import { OrderBookData } from '../api/model/orderBookData';
import { OrderBookRow } from '../api/model/orderBookRow';

export class OrderBookList {
  public static readonly EMPTY_DATA: number = 0;
  private static readonly DIVIDER = 10000;

  public constructor(data: OrderBookData) {
    this._data = { ...data };
  }

  private _yAxisValues: string[] = [];

  get yAxisValues(): string[] {
    return this._yAxisValues;
  }

  private _data!: OrderBookData;

  get data(): OrderBookData {
    return {
      p: this._data.p,
      b: this._cumulative ? this._cumulativeBuy : this._normalBuy,
      s: this._cumulative ? this._cumulativeSell : this._normalSell,
      f: this._data.f,
    };
  }

  get rawData(): OrderBookData {
    return this._data;
  }

  private _normalBuy: OrderBookRow[] = [];

  get normalBuy(): OrderBookRow[] {
    return this._normalBuy;
  }

  private _normalSell: OrderBookRow[] = [];

  get normalSell(): OrderBookRow[] {
    return this._normalSell;
  }

  private _cumulativeBuy: OrderBookRow[] = [];

  get cumulativeBuy(): OrderBookRow[] {
    return this._cumulativeBuy;
  }

  private _cumulativeSell: OrderBookRow[] = [];

  get cumulativeSell(): OrderBookRow[] {
    return this._cumulativeSell;
  }

  private _cumulative = false;

  public set cumulative(cumulative: boolean) {
    this._cumulative = cumulative;
  }

  get sortedTableBuy(): OrderBookRow[] {
    return this._cumulative
      ? this._cumulativeBuy.sort((a: OrderBookRow, b: OrderBookRow) => {
          if (a.r !== b.r) {
            return a.r - b.r;
          }
          return a.a - b.a;
        })
      : this._normalBuy.sort((a: OrderBookRow, b: OrderBookRow) => {
          if (a.r !== b.r) {
            return a.r - b.r;
          }
          return a.a - b.a;
        });
  }

  get sortedTableSell(): OrderBookRow[] {
    return this._cumulative
      ? this._cumulativeSell.sort((a: OrderBookRow, b: OrderBookRow) => {
          if (a.r !== b.r) {
            return a.r - b.r;
          }
          return a.a - b.a;
        })
      : this._normalSell.sort((a: OrderBookRow, b: OrderBookRow) => {
          if (a.r !== b.r) {
            return a.r - b.r;
          }
          return a.a - b.a;
        });
  }

  public fullUpdate(data: OrderBookData) {
    this._data = data;
    this.clear();
    this.prepareOrderBookData();
  }

  public clear(): void {
    this._normalBuy = [];
    this._normalSell = [];
    this._cumulativeBuy = [];
    this._cumulativeSell = [];
  }

  public partialUpdate(partialData: OrderBookData) {
    if (partialData != undefined) {
      partialData.b.forEach((buyRow: OrderBookRow) => {
        let changedRow = this._data.b.find((currentRow) => {
          return currentRow.r === buyRow.r;
        });
        if (changedRow) {
          changedRow.a = changedRow.a + buyRow.a;
        } else {
          this._data.b.push(buyRow);
        }
      });
      this._data.b = this._data.b.filter((row: OrderBookRow) => {
        return row.a > 0;
      });

      partialData.s.forEach((sellRow: OrderBookRow) => {
        let changedRow = this._data.s.find((currentRow) => {
          return currentRow.r === sellRow.r;
        });
        if (changedRow) {
          changedRow.a = changedRow.a + sellRow.a;
        } else {
          this._data.s.push(sellRow);
        }
      });
      this._data.s = this._data.s.filter((row: OrderBookRow) => {
        return row.a > 0;
      });
    }
  }

  public prepareOrderBookData() {
    const sorterBuyArray: OrderBookRow[] = this.sortArray(this._data.b);
    const sorterSellArray: OrderBookRow[] = this.sortArray(this._data.s);
    let cumulativeData = 0;
    this._yAxisValues = [];
    if (sorterBuyArray) {
      sorterBuyArray.forEach((row) => {
        this._yAxisValues.push((row.r / OrderBookList.DIVIDER).toFixed(4));
      });
      sorterBuyArray.forEach((x) => {
        this._normalBuy.push(x);
      });
      sorterBuyArray
        .sort((first: OrderBookRow, second: OrderBookRow) => {
          return this.sortFunction(second, first);
        })
        .forEach((x) => {
          cumulativeData += x.a;
          this._cumulativeBuy.splice(0, 0, { ...x, a: cumulativeData });
        });

      sorterBuyArray
        .map((orderBookRow: OrderBookRow) => {
          return orderBookRow.r;
        })
        .sort((a, b) => {
          return a - b;
        })
        .forEach((row) => {
          this._normalSell.push({ r: row, a: OrderBookList.EMPTY_DATA });
          this._cumulativeSell.push({ r: row, a: OrderBookList.EMPTY_DATA });
        });
    }
    if (sorterSellArray) {
      sorterSellArray.forEach((row) => {
        this._yAxisValues.push((row.r / OrderBookList.DIVIDER).toFixed(4));
      });
      sorterSellArray.forEach((row) => {
        this._normalBuy.push({ r: row.r, a: OrderBookList.EMPTY_DATA });
        this._cumulativeBuy.push({ r: row.r, a: OrderBookList.EMPTY_DATA });
      });

      cumulativeData = 0;

      sorterSellArray.forEach((x) => {
        cumulativeData += x.a;
        this._normalSell.push(x);
        this._cumulativeSell.push({ ...x, a: cumulativeData });
      });
    }
  }

  public sortArray(unsortedArray: OrderBookRow[]): OrderBookRow[] {
    if (unsortedArray == undefined) {
      return unsortedArray;
    }
    return unsortedArray.sort((a: OrderBookRow, b: OrderBookRow) => {
      return this.sortFunction(a, b);
    });
  }

  public sortFunction(a: OrderBookRow, b: OrderBookRow): number {
    if (a.r !== b.r) {
      return a.r - b.r;
    }
    return a.a - b.a;
  }
}
