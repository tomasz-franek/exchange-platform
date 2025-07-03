import { OrderBookData } from '../api/model/orderBookData';
import { OrderBookRow } from '../api/model/orderBookRow';

export class OrderBookList {
  public static readonly EMPTY_DATA: any = '';
  private _yAxisValues: string[] = [];
  private _data!: OrderBookData;
  private _normalBid: number[] = [];
  private _normalAsk: number[] = [];
  private _cumulativeBid: number[] = [];
  private _cumulativeAsk: number[] = [];

  public constructor(data: OrderBookData) {
    this._data = data;
  }

  private sortArray(unsortedArray: Array<OrderBookRow>): any[] {
    return unsortedArray.sort((a, b) => {
      if (a.r < b.r) return -1;
      if (a.r > b.r) return 1;
      return 0;
    });
  }

  public updateData(data: OrderBookData) {
    this._data = data;
    this.prepareOrderBookData();
  }

  public prepareOrderBookData() {
    const sorterBuyArray: OrderBookRow[] = this.sortArray(this._data.b);
    const sorterSellArray: OrderBookRow[] = this.sortArray(this._data.s);

    this._yAxisValues = [];
    sorterSellArray.forEach((b) => {
      this._yAxisValues.push(b.r.toFixed(4));
    });
    sorterBuyArray.forEach((a) => {
      this._yAxisValues.push(a.r.toFixed(4));
    });
    let cumulativeData: number = 0;
    sorterSellArray.forEach((x) => {
      this._normalBid.push(-x.a);
    });
    sorterSellArray.forEach((x) => {
      cumulativeData += -x.a;
      this._cumulativeBid.splice(0, 0, cumulativeData);
    });
    sorterBuyArray.reverse().forEach(() => {
      this._normalBid.push(OrderBookList.EMPTY_DATA);
      this._cumulativeBid.push(OrderBookList.EMPTY_DATA);
    });

    cumulativeData = 0;
    sorterSellArray.forEach(() => {
      this._normalAsk.push(OrderBookList.EMPTY_DATA);
      this.cumulativeAsk.push(OrderBookList.EMPTY_DATA);
    });
    sorterBuyArray.forEach((x) => {
      cumulativeData += x.a;
      this._normalAsk.push(x.a);
      this._cumulativeAsk.push(cumulativeData);
    });
  }

  get yAxisValues(): string[] {
    return this._yAxisValues;
  }

  get normalBid(): number[] {
    return this._normalBid;
  }

  get normalAsk(): number[] {
    return this._normalAsk;
  }

  get cumulativeBid(): number[] {
    return this._cumulativeBid;
  }

  get cumulativeAsk(): number[] {
    return this._cumulativeAsk;
  }

  get data(): OrderBookData {
    return this._data;
  }
}
