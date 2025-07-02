import { OrderBookData } from '../api/model/orderBookData';
import { OrderBookRow } from '../api/model/orderBookRow';

export class OrderBookList {
  public static readonly EMPTY_DATA: any = '';
  private _yAxisValues: any[] = [];
  private _data!: OrderBookData;
  private _normalBidData: any[] = [];
  private _normalAskData: any[] = [];
  private _cumulativeBidData: any[] = [];
  private _cumulativeAskData: any[] = [];

  public constructor(data: OrderBookData) {
    this._data = data;
  }

  private sortArray(unsortedArray: Array<OrderBookRow>): any[] {
    return unsortedArray.sort((a, b) => {
      if (a.ratio < b.ratio) return -1;
      if (a.ratio > b.ratio) return 1;
      return 0;
    });
  }

  public updateData(data: OrderBookData) {
    this._data = data;
    this.prepareOrderBookData();
  }

  public prepareOrderBookData() {
    const sorterBuyArray = this.sortArray(this._data.buy);
    const sorterSellArray = this.sortArray(this._data.sell);

    this._yAxisValues = [];
    sorterSellArray.forEach((b) => {
      this._yAxisValues.push(b.ratio.toFixed(4));
    });
    sorterBuyArray.forEach((a) => {
      this._yAxisValues.push(a.ratio.toFixed(4));
    });
    let cumulativeData: number = 0;
    sorterSellArray.forEach((x) => {
      this._normalBidData.push(-x.amount);
    });
    sorterSellArray.reverse().forEach((x) => {
      cumulativeData += -x.amount;
      this._cumulativeBidData.splice(0, 0, cumulativeData);
    });
    sorterBuyArray.forEach(() => {
      this._normalBidData.push(OrderBookList.EMPTY_DATA);
      this._cumulativeBidData.push(OrderBookList.EMPTY_DATA);
    });

    cumulativeData = 0;
    sorterSellArray.forEach(() => {
      this._normalAskData.push(OrderBookList.EMPTY_DATA);
      this.cumulativeAskData.push(OrderBookList.EMPTY_DATA);
    });
    sorterBuyArray.forEach((x) => {
      cumulativeData += x.amount;
      this._normalAskData.push(x.amount);
      this._cumulativeAskData.push(cumulativeData);
    });
  }

  get yAxisValues(): any[] {
    return this._yAxisValues;
  }

  get normalBidData(): any[] {
    return this._normalBidData;
  }

  get normalAskData(): any[] {
    return this._normalAskData;
  }

  get cumulativeBidData(): any[] {
    return this._cumulativeBidData;
  }

  get cumulativeAskData(): any[] {
    return this._cumulativeAskData;
  }

  get data(): any {
    return this._data;
  }
}
