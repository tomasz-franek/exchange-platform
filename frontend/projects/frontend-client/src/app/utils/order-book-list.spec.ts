import { OrderBookList } from './order-book-list';
import { Pair } from '../api/model/pair';
import { OrderBookData } from '../api/model/orderBookData';

describe('OrderBookList', () => {
  let orderBookList: OrderBookList;
  const orderBookDataInitial: OrderBookData = {
    p: Pair.GbpChf,
    f: true,
    b: [
      { r: 20002, a: 10 },
      { r: 20001, a: 20 },
      { r: 20000, a: 25 },
    ],
    s: [
      { r: 20006, a: 10 },
      { r: 20005, a: 20 },
      { r: 20004, a: 30 },
      { r: 20003, a: 40 },
    ],
  };
  const orderBookDataUpdated: OrderBookData = {
    p: Pair.GbpUsd,
    f: false,
    b: [
      { r: 12000, a: 300 },
      { r: 18000, a: 100 },
      { r: 20200, a: 10 },
    ],
    s: [
      { r: 21000, a: 200 },
      { r: 26000, a: 300 },
    ],
  };
  const emptyData: OrderBookData = {
    p: Pair.EurChf,
    f: false,
    b: [],
    s: [],
  };

  beforeEach(() => {
    orderBookList = new OrderBookList({
      p: Pair.GbpChf,
      f: true,
      b: [
        { r: 20002, a: 10 },
        { r: 20001, a: 20 },
        { r: 20000, a: 25 },
      ],
      s: [
        { r: 20006, a: 10 },
        { r: 20005, a: 20 },
        { r: 20004, a: 30 },
        { r: 20003, a: 40 },
      ],
    });
    orderBookList.clear();
    orderBookList.cumulative = false;
  });

  it('should initialize with provided data for not cumulative', () => {
    expect(orderBookList.data.p).toEqual(orderBookDataInitial.p);
    expect(orderBookList.data.f).toEqual(orderBookDataInitial.f);
  });

  it('should initialize with provided data for cumulative', () => {
    orderBookList.cumulative = true;
    expect(orderBookList.data.p).toEqual(orderBookDataInitial.p);
    expect(orderBookList.data.f).toEqual(orderBookDataInitial.f);
  });

  it('should sort correct yAxisValues', () => {
    orderBookList.prepareOrderBookData();

    expect(orderBookList.yAxisValues).toEqual([
      '2.0000',
      '2.0001',
      '2.0002',
      '2.0003',
      '2.0004',
      '2.0005',
      '2.0006',
    ]);
  });

  it('should return correct normalBuy values', () => {
    orderBookList.prepareOrderBookData();

    expect(orderBookList.normalBuy).toEqual([
      { r: 20000, a: 25 },
      { r: 20001, a: 20 },
      { r: 20002, a: 10 },
      { r: 20003, a: 0 },
      { r: 20004, a: 0 },
      { r: 20005, a: 0 },
      { r: 20006, a: 0 },
    ]);
  });

  it('should return correct cumulativeBuy values', () => {
    orderBookList.prepareOrderBookData();
    expect(orderBookList.cumulativeBuy).toEqual([
      { r: 20000, a: 55 },
      { r: 20001, a: 30 },
      { r: 20002, a: 10 },
      { r: 20003, a: 0 },
      { r: 20004, a: 0 },
      { r: 20005, a: 0 },
      { r: 20006, a: 0 },
    ]);
  });

  it('should return correct normalSell values', () => {
    orderBookList.prepareOrderBookData();
    expect(orderBookList.normalSell).toEqual([
      { r: 20000, a: 0 },
      { r: 20001, a: 0 },
      { r: 20002, a: 0 },
      { r: 20003, a: 40 },
      { r: 20004, a: 30 },
      { r: 20005, a: 20 },
      { r: 20006, a: 10 },
    ]);
  });

  it('should return correct cumulativeAsk values', () => {
    orderBookList.prepareOrderBookData();
    expect(orderBookList.cumulativeSell).toEqual([
      { r: 20000, a: 0 },
      { r: 20001, a: 0 },
      { r: 20002, a: 0 },
      { r: 20003, a: 40 },
      { r: 20004, a: 70 },
      { r: 20005, a: 90 },
      { r: 20006, a: 100 },
    ]);
  });

  it('should update data for new dataset', () => {
    orderBookList.cumulative = false;
    orderBookList.fullUpdate(orderBookDataUpdated);
    expect(orderBookList.data.p).toEqual(orderBookDataUpdated.p);
    expect(orderBookList.data.f).toEqual(orderBookDataUpdated.f);
  });
  it('should update yAxisValues for new dataset', () => {
    orderBookList.fullUpdate(orderBookDataUpdated);
    expect(orderBookList.yAxisValues).toEqual([
      '1.2000',
      '1.8000',
      '2.0200',
      '2.1000',
      '2.6000',
    ]);
  });
  it('should update buyValues for new dataset', () => {
    orderBookList.fullUpdate(orderBookDataUpdated);
    expect(orderBookList.data.b).toEqual([
      { r: 12000, a: 300 },
      { r: 18000, a: 100 },
      { r: 20200, a: 10 },
      { r: 21000, a: 0 },
      { r: 26000, a: 0 },
    ]);
  });
  it('should update buyValues to cumulated for new dataset', () => {
    orderBookList.fullUpdate(orderBookDataUpdated);
    orderBookList.cumulative = true;
    expect(orderBookList.data.b).toEqual([
      { r: 12000, a: 410 },
      { r: 18000, a: 110 },
      { r: 20200, a: 10 },
      { r: 21000, a: 0 },
      { r: 26000, a: 0 },
    ]);
  });
  it('should update sellValues for new dataset', () => {
    orderBookList.fullUpdate(orderBookDataUpdated);
    orderBookList.cumulative = false;
    expect(orderBookList.data.s).toEqual([
      { r: 12000, a: 0 },
      { r: 18000, a: 0 },
      { r: 20200, a: 0 },
      { r: 21000, a: 200 },
      { r: 26000, a: 300 },
    ]);
  });
  it('should update sellValues to cumulated for new dataset', () => {
    orderBookList.fullUpdate(orderBookDataUpdated);
    orderBookList.cumulative = true;
    expect(orderBookList.cumulativeSell).toEqual([
      { r: 12000, a: 0 },
      { r: 18000, a: 0 },
      { r: 20200, a: 0 },
      { r: 21000, a: 200 },
      { r: 26000, a: 500 },
    ]);
  });

  it('should handle empty data correctly', () => {
    orderBookList.fullUpdate(emptyData);
    expect(orderBookList.yAxisValues).toEqual([]);
    expect(orderBookList.normalBuy).toEqual([]);
    expect(orderBookList.cumulativeBuy).toEqual([]);
    expect(orderBookList.normalSell).toEqual([]);
    expect(orderBookList.cumulativeSell).toEqual([]);
  });

  it('should sort arrays correctly', () => {
    const unsortedArray = [
      { r: 2.0, a: 150 },
      { r: 1.0, a: 100 },
      { r: 1.5, a: 200 },
    ];
    const sortedArray = orderBookList['sortArray'](unsortedArray);
    expect(sortedArray).toEqual([
      { r: 1.0, a: 100 },
      { r: 1.5, a: 200 },
      { r: 2.0, a: 150 },
    ]);
  });

  it('should sort arrays bull correctly', () => {
    const initialArray: OrderBookData = {
      p: Pair.GbpChf,
      f: true,
      b: [
        { r: 20002, a: 20 },
        { r: 20001, a: 10 },
        { r: 20000, a: 25 },
      ],
      s: [
        { r: 20006, a: 10 },
        { r: 20004, a: 30 },
        { r: 20005, a: 20 },
        { r: 20003, a: 40 },
      ],
    };
    orderBookList = new OrderBookList(initialArray);
    orderBookList.cumulative = true;
    orderBookList.prepareOrderBookData();
    let sortedArray = orderBookList.sortedTableBuy;
    expect(sortedArray).toEqual([
      { r: 20000, a: 55 },
      { r: 20001, a: 30 },
      { r: 20002, a: 20 },
      { r: 20003, a: 0 },
      { r: 20004, a: 0 },
      { r: 20005, a: 0 },
      { r: 20006, a: 0 },
    ]);
    orderBookList = new OrderBookList(initialArray);
    orderBookList.cumulative = false;
    orderBookList.prepareOrderBookData();
    sortedArray = orderBookList.sortedTableBuy;
    expect(sortedArray).toEqual([
      { r: 20000, a: 25 },
      { r: 20001, a: 10 },
      { r: 20002, a: 20 },
      { r: 20003, a: 0 },
      { r: 20004, a: 0 },
      { r: 20005, a: 0 },
      { r: 20006, a: 0 },
    ]);
  });

  it('should sort arrays sell correctly', () => {
    const initialArray: OrderBookData = {
      p: Pair.GbpChf,
      f: true,
      b: [
        { r: 20002, a: 20 },
        { r: 20001, a: 10 },
        { r: 20000, a: 25 },
      ],
      s: [
        { r: 20006, a: 10 },
        { r: 20004, a: 30 },
        { r: 20005, a: 20 },
        { r: 20003, a: 40 },
      ],
    };
    orderBookList = new OrderBookList(initialArray);
    orderBookList.cumulative = true;
    orderBookList.prepareOrderBookData();
    let sortedArray = orderBookList.sortedTableSell;
    expect(sortedArray).toEqual([
      { r: 20000, a: 0 },
      { r: 20001, a: 0 },
      { r: 20002, a: 0 },
      { r: 20003, a: 40 },
      { r: 20004, a: 70 },
      { r: 20005, a: 90 },
      { r: 20006, a: 100 },
    ]);
    orderBookList = new OrderBookList(initialArray);
    orderBookList.cumulative = false;
    orderBookList.prepareOrderBookData();
    sortedArray = orderBookList.sortedTableSell;
    expect(sortedArray).toEqual([
      { r: 20000, a: 0 },
      { r: 20001, a: 0 },
      { r: 20002, a: 0 },
      { r: 20003, a: 40 },
      { r: 20004, a: 30 },
      { r: 20005, a: 20 },
      { r: 20006, a: 10 },
    ]);
  });

  it('should handle empty update data correctly', () => {
    orderBookList.clear();
    const partialUpdateData: OrderBookData = { b: [], s: [] };
    orderBookList.partialUpdate(partialUpdateData);
    let buyArray = Array.from(orderBookList.rawData.b);
    buyArray = orderBookList.sortArray(buyArray);
    expect(buyArray).toEqual([
      { r: 20000, a: 25 },
      { r: 20001, a: 20 },
      { r: 20002, a: 10 },
    ]);
    let sellArray = Array.from(orderBookList.rawData.s);
    sellArray = orderBookList.sortArray(sellArray);
    expect(sellArray).toEqual([
      { r: 20003, a: 40 },
      { r: 20004, a: 30 },
      { r: 20005, a: 20 },
      { r: 20006, a: 10 },
    ]);
  });

  it('should handle sell remove row when amount covered', () => {
    const partialUpdateData: OrderBookData = {
      b: [],
      s: [{ r: 20004, a: -10 }],
    };
    orderBookList.partialUpdate(partialUpdateData);
    let buyArray = Array.from(orderBookList.rawData.b);
    buyArray = orderBookList.sortArray(buyArray);
    expect(buyArray).toEqual([
      { r: 20000, a: 25 },
      { r: 20001, a: 20 },
      { r: 20002, a: 10 },
    ]);
    let sellArray = Array.from(orderBookList.rawData.s);
    sellArray = orderBookList.sortArray(sellArray);
    expect(sellArray).toEqual([
      { r: 20003, a: 40 },
      { r: 20004, a: 20 },
      { r: 20005, a: 20 },
      { r: 20006, a: 10 },
    ]);
  });

  it('should handle sell add row when new ratio', () => {
    const partialUpdateData: OrderBookData = {
      b: [],
      s: [{ r: 20005, a: 32 }],
    };
    orderBookList.partialUpdate(partialUpdateData);
    let buyArray = Array.from(orderBookList.rawData.b);
    buyArray = orderBookList.sortArray(buyArray);
    expect(buyArray).toEqual([
      { r: 20000, a: 25 },
      { r: 20001, a: 20 },
      { r: 20002, a: 10 },
    ]);
    let sellArray = Array.from(orderBookList.rawData.s);
    sellArray = orderBookList.sortArray(sellArray);
    expect(sellArray).toEqual([
      { r: 20003, a: 40 },
      { r: 20004, a: 30 },
      { r: 20005, a: 52 },
      { r: 20006, a: 10 },
    ]);
  });
});
