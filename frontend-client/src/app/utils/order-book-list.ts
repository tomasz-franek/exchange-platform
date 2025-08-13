import { OrderBookData } from '../api/model/orderBookData';
import { OrderBookRow } from '../api/model/orderBookRow';

export class OrderBookList {
  public static readonly EMPTY_DATA: number = 0;
  private _yAxisValues: string[] = [];
  private _data!: OrderBookData;
  private _normalBuy: OrderBookRow[] = [];
  private _normalSell: OrderBookRow[] = [];
  private _cumulativeBuy: OrderBookRow[] = [];
  private _cumulativeSell: OrderBookRow[] = [];
  private _cumulated = false;

  public constructor(data: OrderBookData) {
    this._data = data;
  }

  private sortArray(unsortedArray: OrderBookRow[]): OrderBookRow[] {
    return unsortedArray.sort((a: OrderBookRow, b: OrderBookRow) => {
      if (a.r < b.r) return -1;
      if (a.r > b.r) return 1;
      return 0;
    });
  }

  public set cumulated(cumulated: boolean) {
    this._cumulated = cumulated;
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

    this._yAxisValues = [];
    sorterBuyArray.forEach((a) => {
      this._yAxisValues.push(a.r.toFixed(4));
    });
    sorterSellArray.forEach((b) => {
      this._yAxisValues.push(b.r.toFixed(4));
    });

    let cumulativeData = 0;
    sorterBuyArray.forEach((x) => {
      this._normalBuy.push(x);
    });
    sorterBuyArray.reverse().forEach((x) => {
      cumulativeData += x.a;
      this._cumulativeBuy.splice(0, 0, { ...x, a: cumulativeData });
    });
    sorterSellArray.forEach((x) => {
      this._normalBuy.push({ ...x, a: OrderBookList.EMPTY_DATA });
      this._cumulativeBuy.push({ ...x, a: OrderBookList.EMPTY_DATA });
    });

    cumulativeData = 0;
    sorterBuyArray.reverse().forEach((x) => {
      this._normalSell.push({ ...x, a: OrderBookList.EMPTY_DATA });
      this._cumulativeSell.push({ ...x, a: OrderBookList.EMPTY_DATA });
    });
    sorterSellArray.forEach((x) => {
      cumulativeData += x.a;
      this._normalSell.push(x);
      this._cumulativeSell.push({ ...x, a: cumulativeData });
    });
  }

  get yAxisValues(): string[] {
    return this._yAxisValues;
  }

  get normalBuy(): OrderBookRow[] {
    return this._normalBuy;
  }

  get normalSell(): OrderBookRow[] {
    return this._normalSell;
  }

  get cumulativeBuy(): OrderBookRow[] {
    return this._cumulativeBuy;
  }

  get cumulativeSell(): OrderBookRow[] {
    return this._cumulativeSell;
  }

  get data(): OrderBookData {
    return {
      p: this._data.p,
      b: this._cumulated ? this._cumulativeBuy : this._normalBuy,
      s: this._cumulated ? this._cumulativeSell : this._normalSell,
      f: this._data.f
    };
  }
}
