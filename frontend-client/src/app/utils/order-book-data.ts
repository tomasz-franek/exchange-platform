export class OrderBookData {
  private _yAxisValues: any[] = [];
  private _normalBidData: any[] = [];
  private _normalAskData: any[] = [];
  private _cumulativeBidData: any[] = [];
  private _cumulativeAskData: any[] = [];

  public constructor(public data: any) {
    this.prepareOrderBookData(data);
  }

  private sortArray(unsortedArray: any[]): any[] {
    return unsortedArray.sort((a, b) => {
      if (a.rate < b.rate) return -1;
      if (a.rate > b.rate) return 1;
      return 0;
    });
  }

  public prepareOrderBookData(data: any) {
    const sorterAsks = this.sortArray(data.ask);
    const sorterBids = this.sortArray(data.bid);

    this._yAxisValues = [];
    sorterBids.forEach((b) => {
      this._yAxisValues.push(b.rate.toFixed(4));
    });
    sorterAsks.forEach((a) => {
      this._yAxisValues.push(a.rate.toFixed(4));
    });
    let cumulativeData: number = 0;
    sorterBids.forEach((x) => {
      this._normalBidData.push(-x.amount);
    });
    sorterBids.reverse().forEach((x) => {
      cumulativeData += -x.amount;
      this._cumulativeBidData.splice(0, 0, cumulativeData);
    });
    sorterAsks.forEach(() => {
      this._normalBidData.push('');
      this._cumulativeBidData.push('');
    });

    cumulativeData = 0;
    sorterBids.forEach(() => {
      this._normalAskData.push('');
      this.cumulativeAskData.push('');
    });
    sorterAsks.forEach((x) => {
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
}
