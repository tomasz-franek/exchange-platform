import { OrderBookData } from '../api/model/orderBookData';
import { OrderBookRow } from '../api/model/orderBookRow';

export class OrderBookList {
  public static readonly EMPTY_DATA: number = 0;
  private static readonly DIVIDER = 10000;

  public constructor(data: OrderBookData) {
    this._data = data;
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
      ? this._cumulativeBuy.sort((a, b) => b.r - a.r)
      : this._normalBuy.sort((a, b) => b.r - a.r);
  }

  public updateData(data: OrderBookData) {
    this._data = data;
    this._normalBuy = [];
    this._normalSell = [];
    this._cumulativeBuy = [];
    this._cumulativeSell = [];
    this.prepareOrderBookData();
  }

  public prepareOrderBookData() {
    const sorterBuyArray: OrderBookRow[] = this.sortArray(this._data.b);
    const sorterSellArray: OrderBookRow[] = this.sortArray(this._data.s);
    let cumulativeData = 0;
    this._yAxisValues = [];
    if (sorterBuyArray) {
      sorterBuyArray.forEach((a) => {
        this._yAxisValues.push((a.r / OrderBookList.DIVIDER).toFixed(4));
      });

      sorterBuyArray.forEach((x) => {
        this._normalBuy.push(x);
      });
      sorterBuyArray.reverse().forEach((x) => {
        cumulativeData += x.a;
        this._cumulativeBuy.splice(0, 0, { ...x, a: cumulativeData });
      });
      sorterBuyArray.reverse().forEach((x) => {
        this._normalSell.push({ ...x, a: OrderBookList.EMPTY_DATA });
        this._cumulativeSell.push({ ...x, a: OrderBookList.EMPTY_DATA });
      });
    }
    if (sorterSellArray) {
      sorterSellArray.forEach((b) => {
        this._yAxisValues.push((b.r / OrderBookList.DIVIDER).toFixed(4));
      });
      sorterSellArray.forEach((x) => {
        this._normalBuy.push({ ...x, a: OrderBookList.EMPTY_DATA });
        this._cumulativeBuy.push({ ...x, a: OrderBookList.EMPTY_DATA });
      });

      cumulativeData = 0;

      sorterSellArray.forEach((x) => {
        cumulativeData += x.a;
        this._normalSell.push(x);
        this._cumulativeSell.push({ ...x, a: cumulativeData });
      });
    }
  }

  private sortArray(unsortedArray: OrderBookRow[]): OrderBookRow[] {
    if (unsortedArray == undefined) {
      return unsortedArray;
    }
    return unsortedArray.sort((a: OrderBookRow, b: OrderBookRow) => {
      if (a.r < b.r) return -1;
      if (a.r > b.r) return 1;
      return 0;
    });
  }
}
